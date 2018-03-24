
import json
import unittest

from app import APP, DB
from models import Movie

class GetMovieTests(unittest.TestCase):

    def setUp(self):
        APP.config['TESTING'] = True
        APP.config['WTF_CSRF_ENABLED'] = False
        self.app = APP.test_client()

        DB.Movie.insert_one({
                "tmdb_id" : 3924,
                "original_title" : "Blondie",
                "popularity" : 1.274044,
            })

    def tearDown(self):
        DB.Movie.delete_many({})

    # Tests ##################################

    def test_get_1_movie(self):
        value = Movie.get_movies(1)

        self.assertEqual(1, len(value))

    def test_get_neg1_movie(self):
        value = Movie.get_movies(-1)

        self.assertEqual(1, len(value))

    def test_get_more_movies_than_in_DB(self):
        value = Movie.get_movies(2)

        self.assertEqual(1, len(value))

    def test_api_route_positive(self):
        value = self.app.get('/movies/')

        self.assertEqual(200, value.status_code)

        result = json.loads(value.get_data(as_text=True))

        self.assertEqual(1, len(result))
        self.assertEqual(3924, result[0].get('tmdb_id'))


class GetMovieDetailTests(unittest.TestCase):

    def setUp(self):
        APP.config['TESTING'] = True
        APP.config['WTF_CSRF_ENABLED'] = False
        APP.config['DEBUG'] = False
        self.app = APP.test_client()
        self.assertEqual(APP.debug, False)

    def tearDown(self):
        pass

    def test_get_movie_8_detail(self):
        results, response_code = Movie.get_movie_details(8)

        self.assertEqual(response_code, 200)
        self.assertEqual(results["id"], 8)

    def test_get_illegal_id_movie(self):
        results, response_code = Movie.get_movie_details(-1)
        self.assertEqual(response_code, 404)
        self.assertEqual(results["status_message"], "The resource you requested could not be found.")

    def test_get_api_route_positive(self):
        value = self.app.get('/movie/8/detail/')

        result = json.loads(value.get_data(as_text=True))

        self.assertEqual(8, result.get('id'))
