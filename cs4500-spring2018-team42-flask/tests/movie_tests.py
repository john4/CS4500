
import json
import unittest

from app import app, db
from models import Movie

class GetMovieTests(unittest.TestCase):
	
	def setUp(self):
		app.config['TESTING'] = True
		app.config['WTF_CSRF_ENABLED'] = False
		app.config['DEBUG'] = False
		self.app = app.test_client()
		self.assertEqual(app.debug, False)
		
		db.Movie.insert_one({ 
				"_id" : 3924, 
				"adult" : False, 
				"original_title" : "Blondie", 
				"popularity" : 1.274044, 
				"video" : False
			})
			
		self.m = Movie()
	
	def tearDown(self):
		db.Movie.delete_many({})
		self.m = None

	# Tests ##################################
	
	def test_get_1_movie(self):
		value = self.m.getMovies(1)
				
		self.assertEqual(1, value.count())
		
	def test_get_neg1_movie(self):
		value = self.m.getMovies(-1)
						
		self.assertEqual(1, value.count())
		
	def test_get_more_movies_than_in_db(self):
		value = self.m.getMovies(2)
		
		self.assertEqual(1, value.count())
		
	def test_api_route_positive(self):
		value = self.app.get('/movies/1')
		
		result = json.loads(value.get_data(as_text=True))
						
		self.assertEqual(1, len(result))
		self.assertEqual(3924, result[0]["_id"])
		

class GetMovieDetailTests(unittest.TestCase):

	def setUp(self):
		app.config['TESTING'] = True
		app.config['WTF_CSRF_ENABLED'] = False
		app.config['DEBUG'] = False
		self.app = app.test_client()
		self.assertEqual(app.debug, False)
		
		self.m = Movie()

		
	def tearDown(self):
		self.m = None
		
	def test_get_movie_8_detail(self):
		results, response_code = self.m.getMovieDetails(8)
		
		self.assertEqual(response_code, 200)
		self.assertEqual(results["id"], 8)

	def test_get_illegal_id_movie(self):
		results, response_code = self.m.getMovieDetails(-1)
		self.assertEqual(response_code, 404)
		self.assertEqual(results["status_message"], "The resource you requested could not be found.")
		
	def test_get_api_route_positive(self):
		value = self.app.get('/movies/details/8')
		
		result = json.loads(value.get_data(as_text=True))
				
		self.assertEqual(8, result["id"])