from app import app
from flask import json, make_response, request
from models import User


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

    new_user, response_status = u.register()

    return make_response(new_user, response_status)

@app.route('/user/login/', methods=['POST'])
def login_user():
    email = request.form.get('email')
    password = request.form.get('password')

    if not email or not password:
        return make_response(json.jsonify({"error": "email and password are required"}), 400)

    login_result, response_status = User.attempt_login(email, password)

    return make_response(login_result, response_status)
