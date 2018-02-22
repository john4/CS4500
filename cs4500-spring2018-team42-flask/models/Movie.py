import math, requests
from app import db

class Movie(object):
	def __init__(self):
		self._id = None
		self.original_title = None
		self.popularity = None
		self.video = None
		self.adult = None
		self.reviews = []
		
	def getMovies(self, total):
		results = db.Movie.find(limit = abs(total))

		return results

	def getMovieDetails(self, movie_id):
		url = "https://api.themoviedb.org/3/movie/" + str(movie_id) + "?api_key=020a1282ad51b08df67da919fca9f44e&language=en-US"
		
		results = requests.get(url)
						
		return results.json(), results.status_code