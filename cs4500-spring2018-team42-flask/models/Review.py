""" REVIEWS """
from bson.objectid import ObjectId
from app import DB


class Review(object):
    """
    Represents a rating on a movie in the Spoiled Tomatillos database
    """

    def __init__(self):
        self.tmdb_id = None
        self.user_email = None
        self.rating = 0
        self.description = ''

    def create(self):
        """
        Create a movie review with a rating and a description
        """

        existing_review = DB.Review.find_one({
            'user_email': self.user_email,
            'tmdb_id': self.tmdb_id
        })

        if existing_review:
            return {"error": "trying to create a duplicate review"}, 400

        DB.Review.insert_one(self.__dict__)
        return self.__dict__, 200

    @staticmethod
    def delete(review_id):
        """
        Delete a movie review from the database
        """

        review_data = DB.Review.find_one_and_delete({'_id': ObjectId(review_id)})

        if not review_data:
            return {'error': 'review does not exist'}, 400

        response = {
            'success': 'review has been deleted',
            'review_data': review_data
        }

        return response, 200

    @staticmethod
    def get_all(movie_id):
        """
        Get all Spoiled Tomatillos reviews for movie with id movie_id
        """

        reviews = DB.Review.find({'tmdb_id': movie_id})
        return reviews, 200
