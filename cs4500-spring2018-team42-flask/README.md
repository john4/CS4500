# flask-mongodb-example

## Setup

1. Clone this repository:

`git clone https://github.com/Arianna2028/flask-mongodb-example.git`

2. Install and set up your virtualenv with project dependencies

`sudo pip install virtualenv`
`virtualenv venv`
`. venv/bin/activate`
`sudo pip install -r requirements.txt`

3. Install and set up mongodb

`brew install mongodb`
`sudo mkdir /data/db`
`sudo mongod`

4. Start the application

`export FLASK_APP=app.py`
`export FLASK_DEBUG=1`
`flask run`

## Optional

If you don't want to have to export FLASK_APP and FLASK_DEBUG each time you activate virtualenv, you can modify venv/bin/activate. Put this at the top:

```
export FLASK_APP=app.py
export FLASK_DEBUG=1
```