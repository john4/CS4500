pipeline {
   agent none

   options {
		buildDiscarder(logRotator(numToKeepStr: '5', artifactNumToKeepStr: '5'))
   }

node {
    checkout scm
    docker.image('mysql:5').withRun('-e "MYSQL_ROOT_PASSWORD=my-secret-pw"') { c ->
        docker.image('mysql:5').inside("--link ${c.id}:db") {
            /* Wait until mysql service is up */
            sh 'while ! mysqladmin ping -hdb --silent; do sleep 1; done'
        }
        docker.image('centos:7').inside("--link ${c.id}:db") {
            /*
             * Run some tests which require MySQL, and assume that it is
             * available on the host name `db`
             */
            sh 'make check'
        }
    }
}
   stages {
      stage ( 'Test Back End' ) {
	 agent {
            docker {
              image 'python:3-alpine'
            }
         }
         steps {
            echo  "Testing"
	    sh './flask_tests.sh'
	    step([
		$class: 'CoberturaPublisher',
	        coberturaReportFile: 'coverage.xml',
	        failUnhealthy: true,
	        failUnstable: true
	    ])
         }
	 post {
	    always {
	      deleteDir();
	    }
	 }
      }
      stage ( 'Lint Back End' ) {
	 agent {
            docker {
              image 'clburlison/pylint:py3-wheezy'
            }
         }
	 steps {
	    //source: https://stackoverflow.com/questions/41875412/use-pylint-on-jenkins-with-warnings-plugin-and-pipleine
	    sh 'pip install virtualenv && virtualenv venv && . venv/bin/activate && pip install -r ./cs4500-spring2018-team42-flask/requirements.txt && cd cs4500-spring2018-team42-flask && pylint --disable=W1202 --output-format=parseable --reports=no *.py > pylint.log || echo "pylint exited with $?" && cat pylint.log'
	    step([
              $class                     : 'WarningsPublisher',
              parserConfigurations       : [[
                                              parserName: 'PYLint',
                                              pattern   : 'cs4500-spring2018-team42-flask/pylint.log'
                                           ]],
              unstableTotalAll           : '25',
              usePreviousBuildAsReference: true
            ])
	    deleteDir();
	 }
      }
      stage ( 'Test Front End' ) {
	 agent {
            docker {
              image 'node:9.7-alpine'
            }
         }
	 environment {
            CI = 'true'
         }
         steps {
            echo  "Testing"
            sh 'cd front-end && yarn install && yarn test'
         }
      }
      stage ( 'Lint Front End' ) {
	 agent {
            docker {
              image 'node:9.7-alpine'
            }
         }
	 environment {
            CI = 'true'
         }
         steps {
            echo  "Linting"
            sh 'cd front-end && yarn install && ./node_modules/.bin/eslint -c .eslintrc -f checkstyle -o lint-out.xml src/*.js || true'
	    sh 'cat front-end/lint-out.xml'
	    step([
	      $class: 'CheckStylePublisher',
	      canRunOnFailed: true,
	      defaultEncoding: '',
	      healthy: '100',
	      pattern: 'front-end/lint-out.xml',
	      unHealthy: '90',
	      useStableBuildAsReference: true
	    ])
         }
      }
      stage ( 'Build Front End' ) {
	 agent {
            docker {
              image 'node:9.7-alpine'
            }
         }
         steps {
            echo  "Building"
            sh 'cd front-end && yarn install && yarn build'
         }
	 post {
	    always {
              archiveArtifacts artifacts: 'front-end/build/**/*'
	      deleteDir();
	    }
	 }
      }
   }
}
