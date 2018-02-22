from app import db
from bson.json_util import dumps
from flask import json
from http import HTTPStatus
from werkzeug.security import check_password_hash, generate_password_hash


class User(object):
    def __init__(self):
        self.name = None
        self.email = None
        self.password = None
        self.age = None
        self.genre = []

    def register(self):
        """
        Add this user's information to the database
        Returns some json info on success or error and boolean for success
        """

        if not self.name or not self.email or not self.password or not self.age:
            return json.jsonify({"error": "missing required fields"}), HTTPStatus.BAD_REQUEST

        user_exists = db.User.find_one({"email": self.email})
        if user_exists:
            return json.jsonify({"error": "a user with this email already exists"}), HTTPStatus.BAD_REQUEST

        if len(self.password) < 8:
            return json.jsonify({"error": "passwords must be at least 8 characters"}), HTTPStatus.BAD_REQUEST

        self.password = generate_password_hash(self.password, method='sha256')
        db.User.insert_one(self.__dict__)

        return dumps(self.__dict__), HTTPStatus.OK

    @staticmethod
    def attempt_login(email, password):
        """
        Check to see if this user exists and passwords match
        """

        u = db.User.find_one({"email": email})
        if not u:
            return json.jsonify({"error": "no user with this email exists"}), HTTPStatus.BAD_REQUEST

        if not check_password_hash(u.get('password'), password):
            return json.jsonify({"error": "passwords do not match"}), HTTPStatus.BAD_REQUEST

        return json.jsonify({"success": "user {email} password verified".format(email=email)}), HTTPStatus.OK
