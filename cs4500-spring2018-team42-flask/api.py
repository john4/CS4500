from app import app
from flask import json, make_response, request
from models import User
from models import Movie


@app.route('/')
def index():
    return 'Hello, Team 42!'

@app.route('/user/register/', methods=['POST'])
def register_user():
    u = User()

    u.name = request.form.get('name')
    u.email = request.form.get('email')
    u.age = request.form.get('age')
    u.password = request.form.get('password')
    u.genre = request.form.getlist('genre')

    new_user, response_code = u.register()
    return make_response(new_user, response_code)

@app.route('/movies/<int:count>', methods=['GET'])
def getMovies(count):
	m = Movie()
	
	m.getMovies(count)
	
@app.route('/movies/details/<int:movie_id>', methods=['GET'])
def getMovieDetails(movie_id):
	m = Movie()
	
	results, response_code = m.getMovieDetails(movie_id)
	
	return make_response(results, response_code)