import random
import string
from bson.json_util import dumps
from bson.objectid import ObjectId
from flask import json
from werkzeug.security import check_password_hash, generate_password_hash
from app import DB


class User(object):
    """represents a user on Spoiled Tomatillos"""

    def __init__(self):
        self.name = None
        self.email = None
        self.password = None
        self.age = None
        self.genre = None
        self.photo_url = None

    def register(self):
        """
        Add this user's information to the database
        Returns some json info on success or error and boolean for success
        """

        if not self.name or not self.email or not self.password or not self.age or not self.genre:
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
        existing_user['password'] = '[REDACTED]'

        return_data = {
            'success': 'user {email} password verified'.format(email=email),
            'session_id': session_id,
            'user_data': existing_user
        }

        User.add_session(session_id, email)
        return return_data, 200

    @staticmethod
    def get_user_data_from_session(session_id):
        """
        Gets the user data from the session id
        """
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

        if not session_id:
            return False

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
    def update_user(name, age, photoUrl, genre, email):
		"""
		Update an existing user's details
		"""
		update_data = DB.User.find_one_and_update({"email": email}, {
			'$set': {'name': name,
					 'age': age,
					 'photo_url': photoUrl,
					 'genre': genre
					}
		})
				
		if not update_data:
			return {"error": "no user found to update"}, 400
		
		response = {"success": "user " + email + " has been updated"}
		return response, 200

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


    @staticmethod
    def find_all_user_with_name(name):
        """
        Finds all users with a name string that contains the input string
        """

        user_data = DB.User.find({"name": {'$regex': name}}, projection={'password':False})
        user_data_list = list(user_data)

        if not user_data_list:
            return {"error": "no user with this name exists"}, 400

        return user_data_list, 200


    @staticmethod
    def follow_user_with_id(session_id, oid):
        """
        Follow another user and update that users followMe with caller
        """

        current_user, _status = User.get_user_data_from_session(session_id)

        user_exists = DB.User.find_one({"_id": ObjectId(oid.get('$oid'))})
        if not user_exists:
            return {"error": "A user with that id does not exist"}, 400

        existing_follower = DB.User.find_one(
            {"_id": current_user.get('_id'), "iFollow": ObjectId(oid.get('$oid'))})
        if existing_follower:
            return {"error": "You are already following this user"}, 400

        DB.User.update({'_id': current_user.get('_id')},
                       {'$addToSet': {'iFollow': ObjectId(oid.get('$oid'))}})

        DB.User.update({'_id': ObjectId(oid.get('$oid'))},
                       {'$addToSet':{'followMe': current_user.get('_id')}})

        response = {"success": "user " + current_user.get('email') + " is following the user"}
        return response, 200

    @staticmethod
    def unfollow_user_with_id(session_id, oid):
        """
        UnFollow another user and update that users followMe to remove caller
        """

        current_user, _status = User.get_user_data_from_session(session_id)

        user_exists = DB.User.find_one({"_id": ObjectId(oid.get('$oid'))})
        if not user_exists:
            return {"error": "A user with that id does not exist"}, 400

        existing_follower = DB.User.find_one({"_id": current_user.get('_id'), "iFollow": ObjectId(oid.get('$oid'))})
        if not existing_follower:
            return {"error": "You are not following this user"}, 400

        DB.User.update({'_id': current_user.get('_id')},
                       {'$pull': {'iFollow': ObjectId(oid.get('$oid'))}})

        DB.User.update({'_id': ObjectId(oid.get('$oid'))},
                       {'$pull': {'followMe': current_user.get('_id')}})

        response = {"success": "user " + current_user.get('email') + " is no longer following the user"}
        return response, 200

    @staticmethod
    def get_users_follow_me(user_id):
        """
        Gets the array of people who follow the given user_id string
        """

        found = DB.User.find_one({'_id': ObjectId(user_id)})
        if not found:
            return {"error": "A user with that id does not exist"}, 400

        result = []
        if found.get('followMe'):
            for follower in found.get('followMe'):
                result.append(DB.User.find_one({'_id': follower}, projection={'password':False}))
        return result, 200

    @staticmethod
    def get_users_i_follow(user_id):
        """
        Gets the array of people who the given user_id string follows
        """

        found = DB.User.find_one({'_id': ObjectId(user_id)})
        if not found:
            return {"error": "A user with that id does not exist"}, 400

        result = []
        if found.get('iFollow'):
            for followee in found.get('iFollow'):
                result.append(DB.User.find_one({'_id': followee}, projection={'password':False}))
        return result, 200
