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
                npm ci // use ci instead of install as it is recommended for CI/CD
                '''
            }
        }
        stage('Lint') {
            steps {
                sh 'npm run lint || echo "Lint issues found but continuing build"'
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
                catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                    sh 'npm test'
            }
        }
        stage('UI Test Cypress') {
            steps {
                catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                    sh '''
                    # Install Xvfb if missing
                    which Xvfb || (echo "Installing Xvfb..." && apt-get update && apt-get install -y xvfb)
                    
                    # Run Cypress tests
                    npx cypress run
                    '''
                }
            }
        }
        stage('Deploy to QA') {
            when {
                branch 'master'  // Deploy only if on the master branch
            }
            steps {
                when {
                branch 'master'
                expression { currentBuild.result != 'FAILURE' }
            }
            steps {
                sh 'scp -r build/* user@qa-server:/data1/wwwroot/html/'
            }
            }
        }
    }
    post {
        always {
            archiveArtifacts artifacts: 'build/**', allowEmptyArchive: true
            junit testResults: 'coverage/junit.xml', allowEmptyResults: true
        }
        unstable {
            echo "Build is unstable but deploying anyway"
        }
        failure {
            echo "Build failed, skipping deploy"
        }
    }
    }
}
