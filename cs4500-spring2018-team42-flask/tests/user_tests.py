
import json
import unittest

from app import APP, DB


class UserTests(unittest.TestCase):

    # Set up & tear down ########################################
    # executed prior to each test ###############################

    def setUp(self):
        APP.config['TESTING'] = True
        APP.config['WTF_CSRF_ENABLED'] = False
        APP.config['DEBUG'] = False
        self.app = APP.test_client()
        self.assertEqual(APP.debug, False)

        DB.User.delete_many({})

    # executed after each test
    def tearDown(self):
        pass


    # Tests ########################################

    def test_user_login_does_not_exist(self):
        login = {
            'email': 'notarealemail@notarealplace.com',
            'password': 'ilovepython'
        }

        response = self.app.post('/user/login/', data=json.dumps(login))
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data, {'error': 'no user with this email exists'})

    def test_user_login_success(self):
        user_one = {
            'name': 'Test User 1',
            'email': 'notarealemail1@notarealplace.com',
            'password': 'password',
            'age': 22,
            'genre': ['Mystery', 'Horror']
        }

        response = self.app.post('/user/register/', data=json.dumps(user_one))
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 200)

        login = {
            'email': 'notarealemail1@notarealplace.com',
            'password': 'password'
        }

        response = self.app.post('/user/login/', data=json.dumps(login))
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data.get('success'), 'user notarealemail1@notarealplace.com password verified')
        self.assertIsNotNone(data.get('sessionId'))

    def test_user_login_wrong_pass(self):
        user_one = {
            'name': 'Test User 1',
            'email': 'notarealemail1@notarealplace.com',
            'password': 'ihatepython',
            'age': 22,
            'genre': ['Mystery', 'Horror']
        }

        response = self.app.post('/user/register/', data=json.dumps(user_one))
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 200)

        login = {
            'email': 'notarealemail1@notarealplace.com',
            'password': 'ilovepython'
        }

        response = self.app.post('/user/login/', data=json.dumps(login))
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data, {"error": "passwords do not match"})

    def test_user_register_fail_no_info(self):
        response = self.app.post('/user/register/', data=json.dumps({}))
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data, {'error': 'missing required fields'})

    def test_user_register_short_pass(self):
        user = {
            'name': 'Test User',
            'email': 'notarealemail@notarealplace.com',
            'password': 'root',
            'age': 22,
            'genre': ['Mystery', 'Horror']
        }

        response = self.app.post('/user/register/', data=json.dumps(user))
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data.get('error'), 'passwords must be at least 8 characters')

    def test_user_register_duplicate(self):
        user_one = {
            'name': 'Test User 1',
            'email': 'notarealemail1@notarealplace.com',
            'password': 'password',
            'age': 22,
            'genre': ['Mystery', 'Horror']
        }

        response = self.app.post('/user/register/', data=json.dumps(user_one))
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data.get('name'), 'Test User 1')
        self.assertEqual(data.get('email'), 'notarealemail1@notarealplace.com')
        self.assertEqual(data.get('age'), 22)
        self.assertEqual(data.get('genre'), ['Mystery', 'Horror'])

        user_two = {
            'name': 'Test User 2',
            'email': 'notarealemail1@notarealplace.com',
            'password': 'password',
            'age': 22,
            'genre': ['Action']
        }

        response = self.app.post('/user/register/', data=json.dumps(user_two))
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data.get('error'), 'a user with this email already exists')

        user_two['email'] = 'differentemail@notarealplace.com'
        response = self.app.post('/user/register/', data=json.dumps(user_two))
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data.get('name'), 'Test User 2')
        self.assertEqual(data.get('email'), 'differentemail@notarealplace.com')


if __name__ == "__main__":
    unittest.main()