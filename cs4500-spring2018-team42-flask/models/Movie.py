import requests
from app import DB

class Movie(object):
    """represents a movie in the Spoiled Tomatillos database"""

    def __init__(self):
        self._id = None
        self.original_title = None
        self.popularity = None
        self.video = None
        self.adult = None
        self.reviews = []

    @staticmethod
    def get_movies(count):
        """get a list of movies of 'count' length"""

        results = DB.Movie.find(limit=abs(count))
        return results

    @staticmethod
    def get_movie_details(movie_id):
        """get details from TMDB for a movie of id movie_id"""

        url = "https://api.themoviedb.org/3/movie/" + \
                str(movie_id) + "?api_key=020a1282ad51b08df67da919fca9f44e&language=en-US"

        results = requests.get(url)
        return results.json(), results.status_code
