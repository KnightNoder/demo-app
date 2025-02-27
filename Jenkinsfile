pipeline {
    agent any
    environment {
        NODEJS_HOME = tool name: 'nodejs', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
        PATH = "$NODEJS_HOME/bin:$PATH" // Ensures Jenkins uses the correct Node.js version
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm  // Jenkins automatically checks out the correct branch
                sh 'bash -c "export NVM_DIR=$HOME/.nvm && [ -s $NVM_DIR/nvm.sh ] && . $NVM_DIR/nvm.sh && nvm use 18 || nvm install 18"'
            }
        }
        stage('Verify Checkout') {
            steps {
                sh '''
                git branch --show-current
                ~/nvm-wrapper.sh nvm use 18
                '''
            }
        }
        stage('Install Dependencies') {
            steps {
                sh '''
                ~/nvm-wrapper.sh nvm use 18
                ~/nvm-wrapper.sh npm install
                '''
            }
        }
        stage('Build') {
            steps {
                sh '''
                ~/nvm-wrapper.sh nvm use 18
                ~/nvm-wrapper.sh npm run build
                '''
            }
        }
        stage('Test') {
            steps {
                sh '''
                ~/nvm-wrapper.sh nvm use 18
                ~/nvm-wrapper.sh npm test
                '''
            }
        }
        stage('Deploy to QA') {
            when {
                branch 'master'  // Deploy only if on the master branch
            }
            steps {
                sh '''
                ~/nvm-wrapper.sh nvm use 18
                scp -r build/* user@qa-server:/data1/wwwroot/html/
                '''
            }
        }
    }
    post {
        failure {
            error "Build failed, skipping deploy"
        }
    }
}
