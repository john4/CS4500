from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient


app = Flask(__name__)
CORS(app)

client = MongoClient('mongodb://%s:%s@ec2-54-197-196-20.compute-1.amazonaws.com' % ('admin', 'team42root'))

if not app.config['TESTING'] and not app.config['DEBUG']:
    db = client.SpoiledTomatillos
else:
    db = client.SpoiledTomatillosTest

from api import *
from models import *
