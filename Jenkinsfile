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
                npm ci // use ci instead of 'install', as it is recommended for CI/CD

                # Install missing Cypress dependencies
                #apt-get update
                #apt-get install -y libgbm-dev libnss3 libatk1.0-0 libatk-bridge2.0-0 libx11-xcb1 libdrm2
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
        }
        stage('UI Test Cypress') {
            steps {
                catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                    sh '''
                    export TERM=xterm  # Fix tput warning

                    node -v        
                    sleep 5

                    # Start frontend server in the background
                    npm run dev &

                    # Wait for server to be available (Max 30s)
                    timeout=30
                    while ! curl -s http://localhost:5173 >/dev/null; do
                    sleep 2
                    timeout=$((timeout - 2))
                    if [ $timeout -le 0 ]; then
                        echo "Frontend server did not start in time!"
                        exit 1
                    fi
                    done
                    echo "Frontend server is up!"

                    # Start Xvfb for headless execution
                    Xvfb :99 &
                    export DISPLAY=:99

                    # Run Cypress tests
                    npx cypress run --headless --browser chrome
                    '''
                }
            }
        }
        stage('Deploy to QA') {
            steps {
                // Make the deployment script executable
                sh 'chmod +x ./deploy-to-qa.sh'
                
                // Run the deployment script
                sh './deploy-to-qa.sh'
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

