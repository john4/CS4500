"""important app setup stuff"""


from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient


APP = Flask(__name__)
CORS(APP)

if not APP.config['TESTING'] and not APP.config['DEBUG']:
    CLIENT = MongoClient('mongodb://%s:%s@ec2-54-197-196-20.compute-1.amazonaws.com' \
                     % ('admin', 'team42root'))
    DB = CLIENT.SpoiledTomatillos
else:
    CLIENT = MongoClient('mongodb://localhost:27017')
    DB = CLIENT.SpoiledTomatillosTest

import api
import models
