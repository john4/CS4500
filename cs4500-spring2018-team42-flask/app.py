"""important app setup stuff"""


from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient


APP = Flask(__name__)
CORS(APP)

CLIENT = MongoClient('mongodb://%s:%s@ec2-54-197-196-20.compute-1.amazonaws.com' \
                     % ('admin', 'team42root'))

if not APP.config['TESTING'] and not APP.config['DEBUG']:
    DB = CLIENT.SpoiledTomatillos
else:
    DB = CLIENT.SpoiledTomatillosTest

import api
import models
