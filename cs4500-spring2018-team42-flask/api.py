"""exposed API routes"""

from flask import json, make_response, request, jsonify
from app import APP
from models import Movie, User, Review

active_sessions = []


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
        return make_response({"error": "email and password are required"}, 400)

    login_result, response_status = User.attempt_login(email, password)
    active_sessions.append(login_result.get('sessionId'))

    return make_response(json.jsonify(login_result), response_status)

@APP.route('/user/logout/', methods=['POST'])
def end_session():
    """delete the given session"""

    data = json.loads(request.data)
    session_id = data.get('sessionId')

    if session_id in active_sessions:
        active_sessions.remove(session_id)
        return make_response(jsonify({"sessionId": session_id}), 200)
    else:
        return make_response(jsonify({"sessionId": session_id}), 400)

@APP.route('/user/detail/', methods=['GET'])
def user_details():
    """check sensitive user details"""

    session_id = request.args.get('sessionId')

    if session_id in active_sessions:
        return make_response(jsonify({"request": "cool"}), 200)
    else:
        return make_response(jsonify({"request": "not cool"}), 400)

@APP.route('/movies/', methods=['GET'])
def get_movies(count):
    """get a list of movies from the db"""

    #TODO: add pagination
    results = Movie.get_movies(10)
    return make_response(jsonify(list(results)), 200)

@APP.route('/movie/<int:movie_id>/detail/', methods=['GET'])
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
