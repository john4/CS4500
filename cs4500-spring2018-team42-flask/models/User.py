from bson.json_util import dumps
from flask import json
from werkzeug.security import check_password_hash, generate_password_hash
from app import DB
import random
import string


class User(object):
    """represents a user on Spoiled Tomatillos"""

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
            return json.jsonify({"error": "missing required fields"}), 400

        user_exists = DB.User.find_one({"email": self.email})
        if user_exists:
            return json.jsonify({"error": "a user with this email already exists"}), 400

        if len(self.password) < 8:
            return json.jsonify({"error": "passwords must be at least 8 characters"}), 400

        self.password = generate_password_hash(self.password, method='sha256')
        DB.User.insert_one(self.__dict__)

        return dumps(self.__dict__), 200

    @staticmethod
    def attempt_login(email, password):
        """
        Check to see if this user exists and passwords match
        """

        existing_user = DB.User.find_one({"email": email})
        if not existing_user:
            return {"error": "no user with this email exists"}, 400

        if not check_password_hash(existing_user.get('password'), password):
            return {"error": "passwords do not match"}, 400

        session_id = ''.join(random.SystemRandom().choice(string.ascii_uppercase + string.digits) for _ in range(32))

        return {"success": "user {email} password verified".format(email=email), "email": email, "sessionId": session_id}, 200
