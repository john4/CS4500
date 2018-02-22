from app import app
from flask import json, make_response, request
from models import User


@app.route('/')
def index():
    return 'Hello, Team 42!'

@app.route('/user/register/', methods=['POST'])
def register_user():
    u = User()
    data = json.loads(request.data)

    u.name = data.get('name')
    u.email = data.get('email')
    u.age = data.get('age')
    u.password = data.get('password')
    u.genre = data.get('genre')

    new_user, response_status = u.register()

    return make_response(new_user, response_status)

@app.route('/user/login/', methods=['POST'])
def login_user():
    data = json.loads(request.data)
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return make_response(json.jsonify({"error": "email and password are required"}), 400)

    login_result, response_status = User.attempt_login(email, password)

    return make_response(login_result, response_status)
