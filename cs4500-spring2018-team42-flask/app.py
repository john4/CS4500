"""important app setup stuff"""


from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient
import config


APP = Flask(__name__)
CORS(APP)

if not APP.config['TESTING'] and not APP.config['DEBUG']:
    CLIENT = MongoClient(config.FLASK_DB_URI \
                     % (config.FLASK_DB_USERNAME, config.FLASK_DB_SECRET))
    DB = CLIENT.SpoiledTomatillos
else:
    CLIENT = MongoClient('mongodb://localhost:27017')
    DB = CLIENT.SpoiledTomatillosTest

import api
import models
