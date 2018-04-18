#!/bin/bash

# Note: you must have python3, pip3, and the pandas 
# package installed on the machine in order
# to run this script.
export FLASK_APP=app.py
export FLASK_DEBUG=0
virtualenv -p python3 venv --system-site-packages
. venv/bin/activate
pip3 install -r requirements.txt
pip3 install gunicorn
gunicorn -w 3 app:APP -b 0.0.0.0:5000 &
