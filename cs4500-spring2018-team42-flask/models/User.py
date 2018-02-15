from app import db
from bson.json_util import dumps
from flask import json
from werkzeug.security import check_password_hash, generate_password_hash

# return check_password_hash(self.password, password)

class User(object):
    def __init__(self):
        self.name = None
        self.email = None
        self.password = None
        self.age = None
        self.genres = []

    def register(self):
        """
        Add this user's information to the database
        """

        if not self.name or not self.email or not self.password or not self.age:
            return json.jsonify({"error": "missing required fields"})

        user_exists = db.User.find_one({"email": self.email})
        if user_exists:
            return json.jsonify({"error": "a user with this email already exists"})

        if len(self.password) < 8:
            return json.jsonify({"error": "password not long enough"})

        self.password = generate_password_hash(self.password, method='sha256')
        db.User.insert_one(self.__dict__)

        return dumps(self.__dict__)
