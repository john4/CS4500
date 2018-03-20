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

        return_data = {
            "success": "user {email} password verified".format(email=email),
            "email": email,
            "session_id": session_id
        }

        User.add_session(session_id, email)
        return return_data, 200

    @staticmethod
    def get_user_data_from_session(session_id):
        session = DB.Session.find_one({'session_id': session_id})

        if session:
            user_email = session.get('email')
            if user_email:
                user = DB.User.find_one({'email': user_email})

                if user:
                    return user, 200
            return {'error': 'user not found'}, 400
        return {'error': 'session not found'}, 400

    @staticmethod
    def check_session(session_id):
        """
        Check to see if a session is valid
        """
        existing_session = DB.Session.find_one({'session_id': session_id})
        return bool(existing_session)

    @staticmethod
    def end_session(session_id):
        """
        End a session
        """

        existing_session = DB.Session.find_one({'session_id': session_id})

        if existing_session:
            DB.Session.delete_one({'session_id': session_id})
            return_data = {
                'success': 'session deleted',
                'session_id': session_id
            }

            return return_data, 200
        else:
            response = {
                'error': 'session does not exist',
                'session_id': session_id
            }

            return response, 400

    @staticmethod
    def add_session(session_id, email):
        """
        Start a new session
        """
        DB.Session.insert_one({
            'session_id': session_id,
            'email': email
        })

    @staticmethod
    def delete_user(email):
        """
        Deletes user whose email matches the input, if it exists
        """

        user_data = DB.User.find_one_and_delete({"email": email})

        if not user_data:
            return {"error": "no user with this email exists"}, 400

        response = {"success": "user " + email + " has been deleted"}
        return response, 200
