stage('Test') {
    steps {
        sh 'npm install'
        sh 'npm run test:once -- --coverage'
    }
}

stage('SonarQube analysis') {
    when {
        expression { build.deployEnv == 'dev' }
    }
    steps {
        script {
            z.sonarqube.scan(
                sonarQualityProfiles: ["typescript": "SonarQube Profile"],
                sonarOpts: [
                    'sonar.projectKey': '',
                    'sonar.sources': './src',
                    'sonar.cpd.exclusions': '**/*-mock.ts',
                    'sonar.javascript.lcov.reportPaths': './coverage/lcov.info',
                ]
            )
        }
    }
}
