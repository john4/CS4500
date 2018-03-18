import requests
from bson.json_util import dumps
from flask import json

from app import DB


class Review(object):
    """represents a rating on a movie in the Spoiled Tomatillos database"""

    def __init__(self):
        self.tmdb_id = None
        self.user_email = None
        self.rating = 0

    def create(self):
        """rate a movie from 1-5 stars (later: add more review stuff)"""

        existing_review = DB.Review.find_one({"user_email": self.user_email, "tmdb_id": self.tmdb_id})
        if existing_review:
            return {"error": "trying to create a duplicate review"}, 400

        DB.Review.insert_one(self.__dict__)
        return self.__dict__, 200

    # TODO: separate update
    # if existing_rating:
    #     DB.Review.update_one(
    #         {"user_email": user_email, "tmdb_id": movie_id},
    #         {"$set": {
    #                 "rating": rating
    #             }
    #         })
