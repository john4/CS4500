""" PROD """

import datetime
from app import DB
from bson.objectid import ObjectId


class Prod(object):
    """
    Represents a recommendation from one user to another
    """

    def __init__(self, sender, receiver, tmdb_id, message=None):
        self.sender = ObjectId(sender)
        self.receiver = ObjectId(receiver)
        self.tmdb_id = tmdb_id
        self.message = message or ''

        self.read = False
        self.timestamp = datetime.datetime.utcnow()

    def create(self):
        """
        Create an instance of a prod
        """

        self.sender_name = DB.User.find_one({'_id': ObjectId(self.sender)}).get('name')
        DB.Prod.insert_one(self.__dict__)
        return self.__dict__, 200

    @staticmethod
    def mark_read(prod_id):
        """
        Mark a prod as read
        """

        existing_prod = DB.Prod.find_one({'_id': ObjectId(prod_id)})
        if not existing_prod:
            return {'error': 'prod does not exist'}, 400

        DB.Prod.update_one(
            {'_id': ObjectId(prod_id)},
            {'$set': {'read': True}})

        return {'success': 'prod marked as read'}, 200

    @staticmethod
    def get_all_for_user(user_id):
        """
        Get all prods received by this user; returns a list
        """

        prods = DB.Prod.find({"receiver": ObjectId(user_id)})
        return list(prods), 200
