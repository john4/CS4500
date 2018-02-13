import random
from flask import Flask, json
from pymongo import MongoClient


app = Flask(__name__)
client = MongoClient('mongodb://%s:%s@ec2-54-197-196-20.compute-1.amazonaws.com' % ('admin', 'team42root'))

@app.route('/')
def index():
    return 'Hello, Team 42!'

@app.route('/api/hello/insert/')
def insert_default_db():
    """
    Insert a default message into the MongoDB database
    """

    db = client.Hello
    hello_object = {"message": "Hello Team 42!"}
    hello_object_id = db.HelloObject.insert_one(hello_object)

    return str(hello_object)

@app.route('/api/hello/insert/<insert>')
def insert_db(insert):
    """
    Insert a custom message into the MongoDB database
    """

    db = client.Hello
    hello_object = {"message": insert}
    hello_object_id = db.HelloObject.insert_one(hello_object)

    return str(hello_object)

@app.route('/api/hello/select/all/')
def query_db():
    """
    Retrieve all HelloObject records from the MongoDB database
    """

    db = client.Hello
    hello_objects = db.HelloObject.find()
    out = [str(ho) for ho in hello_objects]
    return json.jsonify(out)
