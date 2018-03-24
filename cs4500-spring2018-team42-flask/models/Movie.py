import requests
from flask import json

from app import DB


class Movie(object):
    """represents a movie in the Spoiled Tomatillos database"""

    def __init__(self):
        self.tmdb_id = None
        self.original_title = None
        self.popularity = None
        self.reviews = []

    @staticmethod
    def get_movies(count):
        """get a list of movies of 'count' length"""

        results = DB.Movie.find(limit=abs(count))
        return list(results)

    @staticmethod
    def get_movie_details(movie_id):
        """get details from TMDB for a movie of id movie_id"""

        url = "https://api.themoviedb.org/3/movie/" + \
              str(movie_id) + "?api_key=020a1282ad51b08df67da919fca9f44e&language=en-US"

        # results = DB.Movie.find({"tmdb_id": str(movie_id)})

        # Cache Data in our Database
        # if results.count() != 1:
        #
        #     results = requests.get(url).json()
        #
        #
        #     movie = Movie()
        #     movie.tmdb_id = results["id"]
        #     movie.original_title = results["original_title"]
        #     movie.popularity = results["popularity"]
        #
        #     DB.Movie.post(json.dumps(movie))

        results = requests.get(url)

        return results.json(), results.status_code

    @staticmethod
    def get_average_rating(movie_id):
        reviews = DB.Review.find({'tmdb_id': movie_id})
        reviews = [review for review in reviews]

        if len(reviews) > 0:
            ratings = [int(review.get('rating')) for review in reviews]
            ratings_avg = sum(ratings) / len(ratings)
        else:
            ratings_avg = 0

        return json.jsonify({'avg_rating': ratings_avg}), 200
