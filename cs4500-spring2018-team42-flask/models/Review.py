""" REVIEWS """

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
    def get_all(movie_id):
        """
        Get all Spoiled Tomatillos reviews for movie with id movie_id
        """

        reviews = DB.Review.find({'tmdb_id': movie_id})
        return reviews, 200
