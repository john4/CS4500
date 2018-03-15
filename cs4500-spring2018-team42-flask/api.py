"""exposed API routes"""

from flask import json, make_response, request, jsonify
from app import APP
from models import Movie, User, Review


@APP.route('/')
def index():
    """basic index route helpful for testing connection"""

    return 'Hello, Team 42!'

@APP.route('/user/register/', methods=['POST'])
def register_user():
    """request new user registration"""

    new_user = User()
    data = json.loads(request.data)

    new_user.name = data.get('name')
    new_user.email = data.get('email')
    new_user.age = data.get('age')
    new_user.password = data.get('password')
    new_user.genre = data.get('genre')

    new_user, response_status = new_user.register()

    return make_response(new_user, response_status)

@APP.route('/user/login/', methods=['POST'])
def login_user():
    """check an email and password login"""

    data = json.loads(request.data)
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return make_response(json.jsonify({"error": "email and password are required"}), 400)

    login_result, response_status = User.attempt_login(email, password)

    return make_response(login_result, response_status)

@APP.route('/movies/<int:count>/', methods=['GET'])
def get_movies(count):
    """get a list of movies from the db"""

    results = Movie.get_movies(count)
    return make_response(jsonify(list(results)), 200)

@APP.route('/movies/details/<int:movie_id>/', methods=['GET'])
def get_movie_details(movie_id):
    """get a movie's details from the db"""

    results, response_code = Movie.get_movie_details(movie_id)

    return make_response(jsonify(results), response_code)

@APP.route('/movie/<int:movie_id>/review/', methods=['POST'])
def review_movie(movie_id):
    """rate a movie from 1-5 stars (add more later)"""
    #TODO: handle update

    new_review = Review()
    data = json.loads(request.data)

    new_review.tmdb_id = movie_id
    new_review.user_email = data.get('user_email')
    new_review.rating = data.get('rating')

    results, response_code = new_review.create()
    return make_response(results, response_code)

@APP.route('/movie/<int:movie_id>/rating/', methods=['GET'])
def get_movie_avg_rating(movie_id):
    """get the average rating for a movie"""

    results, response_code = Movie.get_average_rating(movie_id)
    return make_response(results, response_code)
