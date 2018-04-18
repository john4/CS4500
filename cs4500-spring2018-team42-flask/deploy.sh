#!/bin/bash

# Note: you must have python3, pip3, and the pandas
# package installed on the machine in order
# to run this script.
export FLASK_APP=app.py
export FLASK_DEBUG=0
pip3 install -r requirements.txt
/usr/local/bin/gunicorn -w 3 app:APP -b 0.0.0.0:5000 &

exit 0
