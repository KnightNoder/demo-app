#!/bin/bash

# Configuration - modify these variables as needed
QA_SERVER_USER="jenkins"
QA_SERVER_HOST="10.1.2.12"
QA_HTML_PATH="index_v2.php"
QA_DEPLOY_PATH="./"
DIST_DIR="dist"  # the local build output directory

# Password handling - use Jenkins credentials or environment variables
# DO NOT hardcode the password in the script
# This example assumes the password is passed as an environment variable
if [ -z "$SSH_PASSWORD" ]; then
    echo "Error: SSH_PASSWORD environment variable not set."
    exit 1
fi


# Step 1: Download the current HTML file from QA server
echo "Downloading index_v2.php from QA server..."
set -x  # Turn on command echoing
sshpass -p "$SSH_PASSWORD" scp -o StrictHostKeyChecking=no -P 4993 "${QA_SERVER_USER}@${QA_SERVER_HOST}:${QA_HTML_PATH}" ./index_v2.php
set +x  # Turn off command echoing

if [ ! -f "./index_v2.php" ]; then
    echo "Error: Failed to download index_v2.php from QA server."
    exit 1
fi
echo "Successfully downloaded index_v2.php"

#find the existing index-*.js and index-*.css files in the downloaded index_v2.php
EXISTING_JS_FILENAME=$(grep -oP '<script type="module" crossorigin src="\K[^"]+' ./index_v2.php)
EXISTING_CSS_FILENAME=$(grep -oP '<link rel="stylesheet" crossorigin href="\K[^"]+' ./index_v2.php)

echo "Existing JS in index_v2.php on QA server: $EXISTING_JS_FILENAME"
echo "Existing CSS in index_v2.php on QA server: $EXISTING_CSS_FILENAME"


# Step 2: Find the latest JS and CSS files from the build
echo "Finding latest assets from build..."
if [ ! -d "$DIST_DIR" ]; then
    echo "Error: Build directory '$DIST_DIR' not found."
    echo "Make sure to run npm build before running this script."
    exit 1
fi

# Find the latest JS and CSS files in the dist directory on the jenkins server
LATEST_JS_PATH=$(find ${DIST_DIR}/assets -name "index-*.js" -type f -printf "%T@ %p\n" | sort -n | tail -1 | cut -f2- -d' ')
LATEST_CSS_PATH=$(find ${DIST_DIR}/assets -name "index-*.css" -type f -printf "%T@ %p\n" | sort -n | tail -1 | cut -f2- -d' ')

# Extract just the filenames from the full paths in the dist directory
LATEST_JS_FILENAME=$(basename "$LATEST_JS_PATH")
LATEST_CSS_FILENAME=$(basename "$LATEST_CSS_PATH")

if [ -z "$LATEST_JS_FILENAME" ] || [ -z "$LATEST_CSS_FILENAME" ]; then
    echo "Error: Could not find JS or CSS files in ${DIST_DIR}/assets/"
    exit 1
fi

echo "Found latest assets in ${DIST_DIR}/assets/ on jenkins server:"
echo "- JavaScript filename in dist directory: $LATEST_JS_FILENAME"
echo "- CSS filename in dist directory: $LATEST_CSS_FILENAME"

# Step 3: Update the HTML file with new asset references
echo "Updating asset references in index_v2.php..."
# Create a backup of the original file
cp "./index_v2.php" "./index_v2.php.bak"

# before updating the JS and CSS references, check if EXISTING_JS_FILENAME is same as LATEST_JS_FILENAME
if [ "$EXISTING_JS_FILENAME" == "$LATEST_JS_FILENAME" ]; then
    echo "Warning: No changes were made to JS filename in index_v2.php. Check if the pattern matching is correct."
    #exit 1
    #set a flag to skip the JS update
    SKIP_JS_UPDATE=true
    echo "Proceeding anyway..."
else
    echo "JS filename in index_v2.php is different from the filename in the dist directory."
    #set a flag to skip the JS update
    SKIP_JS_UPDATE=false
fi

# before updating the CSS reference, check if EXISTING_CSS_FILENAME is same as LATEST_CSS_FILENAME
if [ "$EXISTING_CSS_FILENAME" == "$LATEST_CSS_FILENAME" ]; then
    echo "Warning: No changes were made to CSS filename in index_v2.php. Check if the pattern matching is correct."
    #exit 1
    #set a flag to skip the CSS update
    SKIP_CSS_UPDATE=true
    echo "Proceeding to check the current lines of CSS in index_v2.php..."
else
    echo "CSS filename in index_v2.php is different from the filename in the dist directory."
    #set a flag to skip the CSS update
    SKIP_CSS_UPDATE=false
fi


    # tell the user before updating the JS in index_v2.php by showing the corresonding lines of JS in index_v2.php
    echo "Updating JS in index_v2.php... current line:"
    sed -n -E '/<script type="module" crossorigin src="[^"]+"><\/script>/p' "./index_v2.php"

    # tell the user before updating the CSS in index_v2.php by showing the corresonding lines of CSS in index_v2.php
    echo "Updating CSS in index_v2.php... current line:"
    sed -n -E '/<link rel="stylesheet" crossorigin href="[^"]+">/p' "./index_v2.php"


if [ "$SKIP_JS_UPDATE" == true ]; then
    echo "Skipping JS update..."
else
    # Update the JavaScript file reference
    echo "Updating JS filename in index_v2.php..."
    sed -i -E 's/<script type="module" crossorigin src="[^"]+"><\/script>/<script type="module" crossorigin src="'"$JS_FILENAME"'"><\/script>/g' "./index_v2.php"
fi

if [ "$SKIP_CSS_UPDATE" == true ]; then
    echo "Skipping CSS update..."
else
    # Update the CSS file reference
    echo "Updating CSS filename in index_v2.php..."
    sed -i -E 's/<link rel="stylesheet" crossorigin href="[^"]+">/<link rel="stylesheet" crossorigin href="'"$CSS_FILENAME"'">/g' "./index_v2.php"
fi


# Check if any changes were made
echo "Checking if any changes were made to asset references in index_v2.php..."
if diff -q "./index_v2.php" "./index_v2.php.bak" > /dev/null; then
    echo "Info: No changes were made to asset references. Check if the pattern matching is correct."
    #exit 1
    echo "Proceeding ..."
    #let the user know there was a difference in the files
    echo "Showing the difference in index_v2.php before and after:"
    diff -u "./index_v2.php" "./index_v2.php.bak"
    #tell the user that the diff command above should not show any differences
    echo "The diff command above should NOT show any differences."
else
    echo "Info: Asset references updated in index_v2.php."
    #let the user know there was a difference in the files
    echo "Showing the difference in index_v2.php before and after:"
    diff -u "./index_v2.php" "./index_v2.php.bak"
    #tell the user that the diff command above should not show any differences
    echo "The diff command above should show the changes made to the asset references in index_v2.php."
fi

# Step 4: Create a backup on the QA server first
echo "Creating backup of index_v2.php on QA server..."
#sshpass -p "$SSH_PASSWORD" ssh -o StrictHostKeyChecking=no "$QA_SERVER" "cp $QA_HTML_PATH ${QA_HTML_PATH}.$(date +%Y%m%d%H%M%S).bak"
set -x  # Turn on command echoing
#capture the output of the command below and save it to a variable
BACKUP_OUTPUT=$(sshpass -p "$SSH_PASSWORD" ssh -o StrictHostKeyChecking=no -p 4993 "${QA_SERVER_USER}@${QA_SERVER_HOST}" "cp $QA_HTML_PATH ${QA_HTML_PATH}.$(date +%Y%m%d%H%M%S).bak")
set +x  # Turn off command echoing
echo "Backup output: $BACKUP_OUTPUT"
if [ $? -ne 0 ]; then
    echo "Warning: Failed to create backup on QA server. Proceeding anyway..."
fi

# Step 5: Upload the updated HTML file and new assets to QA server
echo "Uploading updated files to QA server..."

# Upload the HTML file
#capture the output of the command below and save it to a variable
UPLOAD_OUTPUT_HTML=$(sshpass -p "$SSH_PASSWORD" scp -o StrictHostKeyChecking=no -P 4993 ./index_v2.php "${QA_SERVER_USER}@${QA_SERVER_HOST}:$QA_HTML_PATH")
echo "Upload output: $UPLOAD_OUTPUT_HTML"
if [ $? -ne 0 ]; then
    echo "Error: Failed to upload updated index_v2.php to QA server."
    exit 1
fi

# Upload the JS file
#capture the output of the command below and save it to a variable
UPLOAD_OUTPUT_JS=$(sshpass -p "$SSH_PASSWORD" scp -o StrictHostKeyChecking=no -P 4993 "$LATEST_JS" "${QA_SERVER_USER}@${QA_SERVER_HOST}:$QA_DEPLOY_PATH/$JS_FILENAME")
echo "Upload output: $UPLOAD_OUTPUT_JS"
if [ $? -ne 0 ]; then
    echo "Error: Failed to upload JS file to QA server."
    exit 1
fi

# Upload the CSS file
#capture the output of the command below and save it to a variable
UPLOAD_OUTPUT_CSS=$(sshpass -p "$SSH_PASSWORD" scp -o StrictHostKeyChecking=no -P 4993 "$LATEST_CSS" "${QA_SERVER_USER}@${QA_SERVER_HOST}:$QA_DEPLOY_PATH/$CSS_FILENAME")
echo "Upload output: $UPLOAD_OUTPUT_CSS"
if [ $? -ne 0 ]; then
    echo "Error: Failed to upload CSS file to QA server."
    exit 1
fi

# Step 6: Change the permissions of the JS,CSS and index_v2.php files to 644
# Change the permissions of the JS,CSS and index_v2.php files to 644
echo "Changing permissions of JS,CSS and index_v2.php files to 644"
#capture the output of the command below and save it to a variable
CHANGE_PERMISSIONS_OUTPUT_JS=$(sshpass -p "$SSH_PASSWORD" ssh -o StrictHostKeyChecking=no -P 4993 "${QA_SERVER_USER}@${QA_SERVER_HOST}" "chmod 644 $QA_DEPLOY_PATH/$JS_FILENAME")
echo "Change permissions output of JS file: $CHANGE_PERMISSIONS_OUTPUT_JS" 
if [ $? -ne 0 ]; then
    echo "Error: Failed to change permissions of JS file on QA server."
    exit 1
fi

#capture the output of the command below and save it to a variable
CHANGE_PERMISSIONS_OUTPUT_CSS=$(sshpass -p "$SSH_PASSWORD" ssh -o StrictHostKeyChecking=no -P 4993 "${QA_SERVER_USER}@${QA_SERVER_HOST}" "chmod 644 $QA_DEPLOY_PATH/$CSS_FILENAME")
echo "Change permissions output of CSS file: $CHANGE_PERMISSIONS_OUTPUT_CSS"
if [ $? -ne 0 ]; then
    echo "Error: Failed to change permissions of CSS file on QA server."
    exit 1
fi

#capture the output of the command below and save it to a variable
CHANGE_PERMISSIONS_OUTPUT_INDEX_V2_PHP=$(sshpass -p "$SSH_PASSWORD" ssh -o StrictHostKeyChecking=no -P 4993 "${QA_SERVER_USER}@${QA_SERVER_HOST}" "chmod 644 $QA_DEPLOY_PATH/index_v2.php")
echo "Change permissions output of index_v2.php file: $CHANGE_PERMISSIONS_OUTPUT_INDEX_V2_PHP"
if [ $? -ne 0 ]; then
    echo "Error: Failed to change permissions of index_v2.php file on QA server."
    exit 1
fi


#step 7: change the ownership of the JS,CSS and index_v2.php file to www-data:www-data
#change the ownership of the index_v2.php file to www-data:www-data
echo "Changing ownership of index_v2.php file to www-data:www-data"
CHANGE_OWNERSHIP_OUTPUT_INDEX_V2_PHP=$(sshpass -p "$SSH_PASSWORD" ssh -o StrictHostKeyChecking=no -P 4993 "${QA_SERVER_USER}@${QA_SERVER_HOST}" "chown www-data:www-data $QA_DEPLOY_PATH/index_v2.php")
echo "Change ownership output of index_v2.php file: $CHANGE_OWNERSHIP_OUTPUT_INDEX_V2_PHP"
if [ $? -ne 0 ]; then
    echo "Error: Failed to change ownership of index_v2.php file on QA server."
    exit 1
fi

#change the ownership of the JS file to www-data:www-data
echo "Changing ownership of JS file to www-data:www-data"
CHANGE_OWNERSHIP_OUTPUT_JS=$(sshpass -p "$SSH_PASSWORD" ssh -o StrictHostKeyChecking=no -P 4993 "${QA_SERVER_USER}@${QA_SERVER_HOST}" "chown www-data:www-data $QA_DEPLOY_PATH/$JS_FILENAME")
echo "Change ownership output of JS file: $CHANGE_OWNERSHIP_OUTPUT_JS"
if [ $? -ne 0 ]; then
    echo "Error: Failed to change ownership of JS file on QA server."
    exit 1
fi

#change the ownership of the CSS file to www-data:www-data
echo "Changing ownership of CSS file to www-data:www-data"
CHANGE_OWNERSHIP_OUTPUT_CSS=$(sshpass -p "$SSH_PASSWORD" ssh -o StrictHostKeyChecking=no -P 4993 "${QA_SERVER_USER}@${QA_SERVER_HOST}" "chown www-data:www-data $QA_DEPLOY_PATH/$CSS_FILENAME")
echo "Change ownership output of CSS file: $CHANGE_OWNERSHIP_OUTPUT_CSS"
if [ $? -ne 0 ]; then
    echo "Error: Failed to change ownership of CSS file on QA server."
    exit 1
fi



echo "- Updated index_v2.php with new asset references"
echo "- Uploaded index_v2.php to QA server"
echo "- Uploaded $JS_FILENAME to QA server"
echo "- Uploaded $CSS_FILENAME to QA server"
echo "- Changed permissions of JS,CSS and index_v2.php files to 644"
echo "- Changed ownership of JS,CSS and index_v2.php files to www-data:www-data"
echo "Deployment complete!"

# Optional: Clean up local files
rm -f ./index_v2.php ./index_v2.php.bak

# Optional: Clean up remote files
#sshpass -p "$SSH_PASSWORD" ssh -o StrictHostKeyChecking=no -P 4993 "${QA_SERVER_USER}@${QA_SERVER_HOST}" "rm -f $QA_DEPLOY_PATH/$JS_FILENAME $QA_DEPLOY_PATH/$CSS_FILENAME $QA_DEPLOY_PATH/index_v2.php"
#echo "Cleaned up remote files"

exit 0