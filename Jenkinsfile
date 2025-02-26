pipeline {
    agent any
    environment {
        NODEJS_HOME = tool name: 'nodejs', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
        PATH = "$NODEJS_HOME/bin:$PATH" // Ensures Jenkins uses the correct Node.js version
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'master', url: 'git@bitbucket.org:drcloud/drc_phoenix_react.git'
                sh '''
                export NVM_DIR="$HOME/.nvm"
                [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                [ -s "$NVM_DIR/bash_completion" ] && . "$NVM_DIR/bash_completion"

                # Ensure we are using Node.js 22
                nvm use 22 || nvm install 22
                node -v
                npm -v
                '''
            }
        }
        stage('Verify Checkout') {
            steps {
                sh '''
                git branch --show-current
                export NVM_DIR="$HOME/.nvm"
                [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                nvm use 22
                node -v
                npm -v
                '''
            }
        }
        stage('Install Dependencies') {
            steps {
                sh '''
                export NVM_DIR="$HOME/.nvm"
                [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                nvm use 22
                node -v
                npm -v
                npm install
                '''
            }
        }
        stage('Build') {
            steps {
                sh '''
                export NVM_DIR="$HOME/.nvm"
                [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                nvm use 22
                node -v
                npm -v
                npm run build
                '''
            }
        }
        stage('Test') {
            steps {
                sh '''
                export NVM_DIR="$HOME/.nvm"
                [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                nvm use 22
                node -v
                npm -v
                npm test
                '''
            }
        }
        stage('Deploy to QA') {
            when {
                branch 'master' // Deploy only if it's the master branch
            }
            steps {
                sh '''
                export NVM_DIR="$HOME/.nvm"
                [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                nvm use 22
                node -v
                npm -v
                scp -r build/* user@qa-server:/data1/wwwroot/html/
                '''
            }
        }
    }
}
