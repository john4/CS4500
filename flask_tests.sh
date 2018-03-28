#!/bin/sh

# set requirements
pip install virtualenv
virtualenv venv
. venv/bin/activate
pip install -r ./cs4500-spring2018-team42-flask/requirements.txt

# run test database
mongod --smallfiles &

# use test database
export FLASK_DEBUG=1

# run tests and coverage report
pip install pytest
pip install pytest-cov
pytest ./cs4500-spring2018-team42-flask/tests/* --verbose --cov=models --cov-report term-missing --cov-report xml --cov-branch --junit-xml results.xml

if [ $? != 0 ] 
then
	exit 1
fi
# stop test database
pkill mongod
