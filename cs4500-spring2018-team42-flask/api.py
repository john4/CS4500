"""exposed API routes"""

from flask import json, make_response, request, jsonify
from bson.json_util import dumps
from app import APP
from models import Logs, Movie, User, Review, Prod


@APP.route('/')
def index():
    """basic index route helpful for testing connection"""

    return 'Hello, Team 42!'

@APP.route('/teapot/')
def teapot():
    """I'm a teapot"""
    return make_response('', 418)

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

    # TODO figure out why this breaks tests

    # log = Logs('register_user', new_user, response_status)
    # log.create()

    return make_response(new_user, response_status)

@APP.route('/user/update/', methods=['POST'])
def update_user():
    """update a user record"""
    data = json.loads(request.data)
    name = data.get('name')
    age = data.get('age')
    photoUrl = data.get('photoUrl')
    genre = data.get('genre')
    email = data.get('email')

    if not email:
        return make_response(dumps({"error": "email is required"}), 400)

    update_result, response_status = User.update_user(name, age, photoUrl, genre, email)

    return make_response(dumps(update_result), response_status)

@APP.route('/user/make-admin/', methods=['POST'])
def make_admin():
    """make another user an admin"""
    data = json.loads(request.data)
    user_id = data.get('user_id')
    session_id = data.get('session_id')

    if not User.check_session(data.get('session_id')):
        log = Logs('make_admin', dumps({'error': 'must be logged in to make a user admin'}), 400)
        log.create()
        return make_response(dumps({'error': 'must be logged in to make a user admin'}), 400)

    if not user_id:
        log = Logs('make_admin', dumps({"error": "user id is required"}), 400)
        log.create()
        return make_response(dumps({"error": "user id is required"}), 400)

    current_user, _status = User.get_user_data_from_session(session_id)

    if not (current_user.get('isAdmin')):
        log = Logs('make_admin', dumps({"error": "you do not have permission to make admin"}), 401)
        log.create()
        return make_response(dumps({"error": "you do not have permission to make admin"}), 401)

    result, response_status = User.make_admin(user_id)
    log = Logs('make_admin', dumps(result), response_status)
    log.create()
    return make_response(dumps(result), response_status)


@APP.route('/user/delete/', methods=['POST'])
def delete_user():
    """delete a user"""

    data = json.loads(request.data)
    user_id = data.get('user_id')
    session_id = data.get('session_id')

    if not User.check_session(data.get('session_id')):
        log = Logs('delete_user', dumps({'error': 'must be logged in to delete a user'}), 400)
        log.create()
        return make_response(dumps({'error': 'must be logged in to delete a user'}), 400)

    if not user_id:
        log = Logs('delete_user', dumps({"error": "user id is required"}), 400)
        log.create()
        return make_response(dumps({"error": "user id is required"}), 400)

    current_user, _status = User.get_user_data_from_session(session_id)

    if not (str(current_user.get('_id')) == user_id or current_user.get('isAdmin')):
        log = Logs('delete_user', dumps({"error": "you cannot delete an account you do not own"}), 401)
        log.create()
        return make_response(dumps({"error": "you cannot delete an account you do not own"}), 401)

    delete_result, response_status = User.delete_user(user_id)
    log = Logs('delete_user', dumps(delete_result), response_status)
    log.create()

    return make_response(dumps(delete_result), response_status)

@APP.route('/user/login/', methods=['POST'])
def login_user():
    """check an email and password login"""

    data = json.loads(request.data)
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return make_response(dumps({"error": "email and password are required"}), 400)

    login_result, response_status = User.attempt_login(email, password)
    log = Logs('login_user', dumps(login_result), response_status)
    log.create()

    return make_response(dumps(login_result), response_status)

@APP.route('/user/logout/', methods=['POST'])
def end_session():
    """
    End a user's session
    """

    data = json.loads(request.data)
    session_id = data.get('sessionId')

    result, response_code = User.end_session(session_id)
    log = Logs('end_session', dumps(result), response_code)
    log.create()
    return make_response(dumps(result), response_code)

@APP.route('/user/detail/', methods=['GET'])
def user_details():
    """check sensitive user details"""

    session_id = request.args.get('sessionId')
    result, response_code = User.get_user_data_from_session(session_id)
    log = Logs('user_details', dumps(result), response_code)
    log.create()
    return make_response(dumps(result), response_code)

@APP.route('/user/<user_id>/detail/', methods=['GET'])
def user_details_by_id(user_id):
    """
    Get user details for a specific user
    """

    result, response_code = User.get_user_data(user_id)
    return make_response(dumps(result), response_code)

@APP.route('/movies/', methods=['GET'])
def get_movies():
    """get a list of movies from the db"""

    results = Movie.get_movies(10)
    log = Logs('get_movies', dumps(results), 200)
    log.create()
    return make_response(dumps(results), 200)

@APP.route('/movie/<int:movie_id>/detail/', methods=['GET'])
def get_movie_details(movie_id):
    """get a movie's details from the db"""

    results, response_code = Movie.get_movie_details(movie_id)
    log = Logs('get_movie_details', dumps(results), response_code)
    log.create()

    return make_response(jsonify(results), response_code)

@APP.route('/movie/<int:movie_id>/review/', methods=['POST'])
def review_movie(movie_id):
    """rate a movie from 1-5 stars (add more later)"""

    new_review = Review()
    data = json.loads(request.data)

    if not User.check_session(data.get('session_id')):
        log = Logs('review_movie', dumps({'error': 'must be logged in to review'}), 400)
        log.create()
        return make_response(dumps({'error': 'must be logged in to review'}), 400)

    new_review.tmdb_id = movie_id
    new_review.user_id = data.get('user_id')
    new_review.user_name = data.get('user_name')
    new_review.rating = data.get('rating')
    new_review.description = data.get('description')
    new_review.movie_title = data.get('movie_title')

    results, response_code = new_review.create()
    log = Logs('review_movie', dumps(results), response_code)
    log.create()
    return make_response(dumps(results), response_code)

@APP.route('/movie/<int:movie_id>/delete-review/', methods=['POST'])
def delete_movie_reviews(movie_id):
    """
    Delete a review from a movie, given the review id
    """

    data = json.loads(request.data)
    review_id = data.get('review_id')
    session_id = data.get('session_id')

    if not (data.get('session_id') and User.check_session(data.get('session_id'))):
        log = Logs('delete_movie_reviews', dumps({'error': 'must be logged in to delete review'}), 400)
        log.create()
        return make_response(dumps({'error': 'must be logged in to delete review'}), 400)

    results, response_code = Review.delete(review_id)
    log = Logs('delete_movie_reviews', dumps(results), response_code)
    log.create()
    return make_response(dumps(results), response_code)

@APP.route('/movie/<int:movie_id>/get-reviews/', methods=['GET'])
def get_movie_reviews(movie_id):
    """
    Get all Spoiled Tomatillos reviews for a movie
    """

    reviews, response_code = Review.for_movie(movie_id)

    # TODO figure out why this breaks tests
    # log = Logs('get_movie_reviews', dumps(reviews), response_code)
    # log.create()
    return make_response(dumps(reviews), response_code)

@APP.route('/user/<user_id>/get-reviews/', methods=['GET'])
def get_user_reviews(user_id):
    """
    Get all Spoiled Tomatillos reviews by a user
    """

    reviews, response_code = Review.for_user(user_id)

    return make_response(dumps(reviews), response_code)

@APP.route('/movie/<int:movie_id>/rating/', methods=['GET'])
def get_movie_avg_rating(movie_id):
    """get the average rating for a movie"""

    results, response_code = Movie.get_average_rating(movie_id)
    # TODO figure out why this breaks tests
    # log = Logs('get_movie_avg_rating', dumps(results), response_code)
    # log.create()
    return make_response(results, response_code)

@APP.route('/user/search/', methods=['GET'])
def search_user():
    """searches for a user with a name containing the given string"""

    name = request.args.get('name')

    results, response_code = User.find_all_user_with_name(name)
    log = Logs('search_user', dumps(results), response_code)
    log.create()

    return make_response(dumps(results), response_code)

@APP.route('/user/follow/', methods=['POST'])
def follow():
    """follows a user with the given id"""

    data = json.loads(request.data)

    if not User.check_session(data.get('session_id')):
        log = Logs('follow', dumps({'error': 'must be logged in to follow'}), 400)
        log.create()
        return make_response(dumps({'error': 'must be logged in to follow'}), 400)

    results, response_code = User.follow_user_with_id(data.get('session_id'), data.get('oid'))
    log = Logs('follow', dumps(results), response_code)
    log.create()
    return make_response(dumps(results), response_code)

@APP.route('/user/unfollow/', methods=['POST'])
def unfollow():
    """unfollows a user with the given id"""

    data = json.loads(request.data)

    if not User.check_session(data.get('session_id')):
        log = Logs('unfollow', dumps({'error': 'must be logged in to unfollow'}), 400)
        log.create()
        return make_response(dumps({'error': 'must be logged in to unfollow'}), 400)

    results, response_code = User.unfollow_user_with_id(data.get('session_id'), data.get('oid'))
    log = Logs('unfollow', dumps(results), response_code)
    log.create()
    return make_response(dumps(results), response_code)

@APP.route('/user/follow-me/', methods=['POST'])
def follow_me_get_all():
    """
    Gets all users who follow a user
    """

    data = json.loads(request.data)

    if not User.check_session(data.get('session_id')):
        log = Logs('follow_me_get_all', dumps({'error': 'must be logged in to view followers'}), 400)
        log.create()
        return make_response(dumps({'error': 'must be logged in to view followers'}), 400)

    user_id = data.get('user_id')
    results, response_code = User.get_users_follow_me(user_id)
    log = Logs('follow_me_get_all', dumps(results), response_code)
    log.create()
    return make_response(dumps(results), response_code)

@APP.route('/user/i-follow/', methods=['POST'])
def i_follow_get_all():
    """
    Gets all users who a user follows
    """

    data = json.loads(request.data)

    if not User.check_session(data.get('session_id')):
        log = Logs('i_follow_get_all', dumps({'error': 'must be logged in to view followers'}), 400)
        log.create()
        return make_response(dumps({'error': 'must be logged in to view followers'}), 400)

    user_id = data.get('user_id')
    results, response_code = User.get_users_i_follow(user_id)
    log = Logs('i_follow_get_all', dumps(results), response_code)
    log.create()
    return make_response(dumps(results), response_code)

@APP.route('/user/i-follow/reviews/', methods=['POST'])
def i_follow_get_all_reviews():
    """
    Gets all reviews by people who a user follows, sorted by most recent
    """

    data = json.loads(request.data)

    if not User.check_session(data.get('session_id')):
        return make_response(dumps({'error': 'must be logged in to view followers'}), 400)

    user_id = data.get('user_id')
    results, response_code = Review.for_users_followed_by(user_id)
    return make_response(dumps(results), response_code)

@APP.route('/user/prod/', methods=['POST'])
def prod_users():
    """
    Send users prods (movie recommendations)
    Return data contains a dict from receiver id to result
    """

    data = json.loads(request.data)

    if not User.check_session(data.get('session_id')):
        log = Logs('prod_users', dumps({'error': 'must be logged in to prod'}), 400)
        log.create()
        return make_response(dumps({'error': 'must be logged in to prod'}), 400)

    receivers = data.get('receivers')
    sender = data.get('sender')
    tmdb_id = data.get('tmdb_id')
    message = data.get('message')

    if not receivers or not sender or not tmdb_id:
        log = Logs('prod_users', dumps({'error': 'sender, receiver, and tmdb id required for prod'}), 400)
        log.create()
        return make_response(dumps({'error': 'sender, receiver, and tmdb id required for prod'}), 400)

    results = {}
    for recv in receivers:
        new_prod = Prod(sender, recv, tmdb_id, message)
        result, rc = new_prod.create()
        results[recv] = result

    log = Logs('prod_users', dumps(results), 200)
    log.create()

    return make_response(dumps(results), 200)

@APP.route('/user/prod/mark-read/', methods=['POST'])
def prod_mark_read():
    """
    Marks prods as read in the database
    """

    data = json.loads(request.data)
    prod_id = data.get('prod_id')
    result, response_code = Prod.mark_read(prod_id)
    log = Logs('prod_mark_read', dumps(result), response_code)
    log.create()
    return make_response(dumps(result), response_code)

@APP.route('/user/prod/get-all/', methods=['POST'])
def prod_get_all():
    """
    Gets all prods for a user
    """

    data = json.loads(request.data)
    user_id = data.get('user_id')
    results, response_code = Prod.get_all_for_user(user_id)
    log = Logs('prod_get_all', dumps(results), response_code)
    log.create()
    return make_response(dumps(results), response_code)

@APP.route('/logs/', methods=['GET'])
def logs_get_all():
    """
    Gets all logs
    """

    data = json.loads(request.data)
    session_id = data.get('session_id')

    if not User.check_session(data.get('session_id')):
        log = Logs('logs_get_all', dumps({'error': 'must be logged in to view logs'}), 400)
        log.create()
        return make_response(dumps({'error': 'must be logged in to view logs'}), 400)

    current_user, _status = User.get_user_data_from_session(session_id)

    if not (current_user.get('isAdmin')):
        log = Logs('logs_get_all', dumps({"error": "you do not have permission to view logs"}), 401)
        log.create()
        return make_response(dumps({"error": "you do not have permission to view logs"}), 401)

    results, response_code = Logs.get_all()
    return make_response(dumps(results), response_code)