pipeline {
    agent { docker { image 'mcr.microsoft.com/playwright:v1.45.1-jammy' } }
    
    stages {
        stage('e2e-tests') {
            steps {
              sh 'npm install'
              sh 'npx playwright test'
            }
        }
        
        stage('Publish HTML Report') {
            steps {
                publishHTML([
                    allowMissing: false,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'playwright-report',
                    reportFiles: 'index.html',
                    reportName: 'Playwright Report'
                ])
            }
        }
    }
}