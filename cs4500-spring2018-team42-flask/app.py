from flask import Flask
from pymongo import MongoClient


app = Flask(__name__)
client = MongoClient('mongodb://%s:%s@ec2-54-197-196-20.compute-1.amazonaws.com' % ('admin', 'team42root'))
db = client.SpoiledTomatillos

from api import *
