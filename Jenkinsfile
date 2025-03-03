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
            }
        }
        stage('Verify Checkout') {
            steps {
                sh '''
                git branch --show-current
                '''
            }
        }
        stage('Install Dependencies') {
            steps {
                sh '''
                node -v
                npm install
                '''
            }
        }
        stage('Build') {
            steps {
                sh '''
                node -v
                npm run build
                '''
            }
        }
        stage('Unit Test JEST') {
            steps {
                sh '''
                node -v
                npm test
                '''
            }
        }
        stage('UI Test Cypress') {
            steps {
                sh '''
                node -v
                npm run dev
                npx cypress run
                '''
            }
        }
        stage('Deploy to QA') {
            when {
                branch 'master'  // Deploy only if on the master branch
            }
            steps {
                sh '''
                node -v
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
