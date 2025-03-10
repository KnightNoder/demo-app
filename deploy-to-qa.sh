#!/bin/bash

# Configuration - modify these variables as needed
QA_SERVER_USER="jenkins"
QA_SERVER_HOST="10.1.2.12"
QA_HTML_PATH="./index_v2.html"
QA_DEPLOY_PATH="./"
DIST_DIR="dist"  # Your local build output directory

# Password handling - use Jenkins credentials or environment variables
# DO NOT hardcode the password in the script
# This example assumes the password is passed as an environment variable
if [ -z "$SSH_PASSWORD" ]; then
    echo "Error: SSH_PASSWORD environment variable not set."
    exit 1
fi

# Step 1: Download the current HTML file from QA server
echo "Downloading index_v2.html from QA server..."
sshpass -p "$SSH_PASSWORD" scp -o StrictHostKeyChecking=no "$QA_SERVER:$QA_HTML_PATH" ./index_v2.html
if [ ! -f "./index_v2.html" ]; then
    echo "Error: Failed to download index_v2.html from QA server."
    exit 1
fi
echo "Successfully downloaded index_v2.html"

# Step 2: Find the latest JS and CSS files from the build
echo "Finding latest assets from build..."
if [ ! -d "$DIST_DIR" ]; then
    echo "Error: Build directory '$DIST_DIR' not found."
    echo "Make sure to run npm build before running this script."
    exit 1
fi

# Find the latest JS and CSS files
LATEST_JS=$(find ${DIST_DIR}/assets -name "index-*.js" -type f -printf "%T@ %p\n" | sort -n | tail -1 | cut -f2- -d' ')
LATEST_CSS=$(find ${DIST_DIR}/assets -name "index-*.css" -type f -printf "%T@ %p\n" | sort -n | tail -1 | cut -f2- -d' ')

# Extract just the filenames
JS_FILENAME=$(basename "$LATEST_JS")
CSS_FILENAME=$(basename "$LATEST_CSS")

if [ -z "$JS_FILENAME" ] || [ -z "$CSS_FILENAME" ]; then
    echo "Error: Could not find JS or CSS files in ${DIST_DIR}/assets/"
    exit 1
fi

echo "Found latest assets:"
echo "- JavaScript: $JS_FILENAME"
echo "- CSS: $CSS_FILENAME"

# Step 3: Update the HTML file with new asset references
echo "Updating asset references in index_v2.html..."
# Create a backup of the original file
cp "./index_v2.html" "./index_v2.html.bak"

# Update the JavaScript file reference
sed -i -E 's/<script type="module" crossorigin src="[^"]+"><\/script>/<script type="module" crossorigin src="'"$JS_FILENAME"'"><\/script>/g' "./index_v2.html"

# Update the CSS file reference
sed -i -E 's/<link rel="stylesheet" crossorigin href="[^"]+">/<link rel="stylesheet" crossorigin href="'"$CSS_FILENAME"'">/g' "./index_v2.html"

# Check if any changes were made
if diff -q "./index_v2.html" "./index_v2.html.bak" > /dev/null; then
    echo "Warning: No changes were made to asset references. Check if the pattern matching is correct."
    exit 1
else
    echo "Success: Asset references updated in index_v2.html."
fi

# Step 4: Create a backup on the QA server first
echo "Creating backup of index_v2.html on QA server..."
sshpass -p "$SSH_PASSWORD" ssh -o StrictHostKeyChecking=no "$QA_SERVER" "cp $QA_HTML_PATH ${QA_HTML_PATH}.$(date +%Y%m%d%H%M%S).bak"
if [ $? -ne 0 ]; then
    echo "Warning: Failed to create backup on QA server. Proceeding anyway..."
fi

# Step 5: Upload the updated HTML file and new assets to QA server
echo "Uploading updated files to QA server..."

# Upload the HTML file
sshpass -p "$SSH_PASSWORD" scp -o StrictHostKeyChecking=no ./index_v2.html "$QA_SERVER:$QA_HTML_PATH"
if [ $? -ne 0 ]; then
    echo "Error: Failed to upload updated index_v2.html to QA server."
    exit 1
fi

# Upload the JS file
sshpass -p "$SSH_PASSWORD" scp -o StrictHostKeyChecking=no "$LATEST_JS" "$QA_SERVER:$QA_DEPLOY_PATH/$JS_FILENAME"
if [ $? -ne 0 ]; then
    echo "Error: Failed to upload JS file to QA server."
    exit 1
fi

# Upload the CSS file
sshpass -p "$SSH_PASSWORD" scp -o StrictHostKeyChecking=no "$LATEST_CSS" "$QA_SERVER:$QA_DEPLOY_PATH/$CSS_FILENAME"
if [ $? -ne 0 ]; then
    echo "Error: Failed to upload CSS file to QA server."
    exit 1
fi

echo "Deployment complete!"
echo "- Updated index_v2.html with new asset references"
echo "- Uploaded index_v2.html to QA server"
echo "- Uploaded $JS_FILENAME to QA server"
echo "- Uploaded $CSS_FILENAME to QA server"

# Optional: Clean up local files
rm -f ./index_v2.html ./index_v2.html.bak

exit 0