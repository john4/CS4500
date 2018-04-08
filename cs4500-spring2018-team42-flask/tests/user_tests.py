
import json
import unittest

from app import APP, DB


class UserTests(unittest.TestCase):

    # Set up & tear down ########################################
    # executed prior to each test ###############################

    def setUp(self):
        APP.config['TESTING'] = True
        APP.config['WTF_CSRF_ENABLED'] = False
        self.app = APP.test_client()

        DB.User.delete_many({})
        DB.Logs.delete_many({})

        DB.User.insert_one({
            'email': 'me@me.com',
            'name': 'Test User',
            'password': 'no'
        })

    # executed after each test
    def tearDown(self):
        DB.Logs.delete_many({})
        DB.Session.delete_many({})


    # Tests ########################################
    def test_get_user_detail_by_id(self):
        user = DB.User.find_one({'email': 'me@me.com'})
        uid = user.get('_id')

        response = self.app.get('/user/{user_id}/detail/'.format(user_id=str(uid)))
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 200)
        self.assertIsNone(data.get('password'))
        self.assertEqual(data.get('email'), 'me@me.com')

        DB.User.delete_one({'email': 'me@me.com'})
        response = self.app.get('/user/{user_id}/detail/'.format(user_id=str(uid)))
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data.get('error'), 'user not found')

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
        user_one = self.generate_user('Test User 1', 'notarealemail1@notarealplace.com')

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
        self.assertIsNotNone(data.get('session_id'))

    def test_user_login_wrong_pass(self):
        user_one = self.generate_user('Test User 1', 'notarealemail1@notarealplace.com')

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

    def test_user_register_fail_no_genre(self):
        user = {
            'name': 'Test User',
            'email': 'notarealemail@notarealplace.com',
            'password': 'password',
            'age': 22,
            'genre': None
        }
        response = self.app.post('/user/register/', data=json.dumps(user))
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data, {'error': 'missing required fields'})


    def test_user_register_short_pass(self):
        user = {
            'name': 'Test User',
            'email': 'notarealemail@notarealplace.com',
            'password': 'root',
            'age': 22,
            'genre': 'Horror'
        }

        response = self.app.post('/user/register/', data=json.dumps(user))
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data.get('error'), 'passwords must be at least 8 characters')

    def test_user_register_duplicate(self):
        user_one = self.generate_user('Test User 1', 'notarealemail1@notarealplace.com')

        response = self.app.post('/user/register/', data=json.dumps(user_one))
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data.get('name'), 'Test User 1')
        self.assertEqual(data.get('email'), 'notarealemail1@notarealplace.com')
        self.assertEqual(data.get('age'), 22)
        self.assertEqual(data.get('genre'), 'Horror')

        user_two = {
            'name': 'Test User 2',
            'email': 'notarealemail1@notarealplace.com',
            'password': 'password',
            'age': 22,
            'genre': 'Action'
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

    def test_user_delete_fail_no_user_id(self):
        DB.Session.insert_one({
            'session_id': 'abcdefghijklmnopqrstuvwyzabcdef',
            'email': 'notarealemail@notarealplace.com'
        })

        data = {
            'session_id': 'abcdefghijklmnopqrstuvwyzabcdef',
        }

        response = self.app.post('/user/delete/', data=json.dumps(data))
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data, {'error': 'user id is required'})

    def test_user_delete_fail_no_session(self):
        DB.Session.insert_one({
            'session_id': 'abcdefghijklmnopqrstuvwyzabcdef',
            'email': 'notarealemail@notarealplace.com'
        })

        data = {
            'user_id':  '000000000000000000000000'
        }

        response = self.app.post('/user/delete/', data=json.dumps(data))
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data, {'error': 'must be logged in to delete a user'})

    def test_admin_user_delete_not_existing(self):
        DB.Session.insert_one({
            'session_id': 'abcdefghijklmnopqrstuvwyzabcdeg',
            'email': 'notarealadminemail@notarealplace.com'
        })

        user = self.generate_user('Test Admin', 'notarealadminemail@notarealplace.com')
        self.app.post('/user/register/', data=json.dumps(user))

        DB.User.find_one_and_update({'email': 'notarealadminemail@notarealplace.com'},
            {'$set': {'isAdmin': True}})

        data = {
            'session_id': 'abcdefghijklmnopqrstuvwyzabcdeg',
            'user_id': '000000000000000000000000'
        }

        response = self.app.post('/user/delete/', data=json.dumps(data))
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data, {'error': 'no user with this id exists'})

    def test_not_admin_user_delete_not_existing(self):
        DB.Session.insert_one({
            'session_id': 'abcdefghijklmnopqrstuvwyzabcdeg',
            'email': 'notarealadminemail@notarealplace.com'
        })

        user = self.generate_user('Test Admin', 'notarealadminemail@notarealplace.com')
        self.app.post('/user/register/', data=json.dumps(user))

        data = {
            'session_id': 'abcdefghijklmnopqrstuvwyzabcdeg',
            'user_id': '000000000000000000000000'
        }
        response = self.app.post('/user/delete/', data=json.dumps(data))
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 401)
        self.assertEqual(data, {'error': 'you cannot delete an account you do not own'})


    def test_user_delete_existing(self):
        DB.Session.insert_one({
            'session_id': 'abcdefghijklmnopqrstuvwyzabcdef',
            'email': 'notarealemail@notarealplace.com'
        })

        user = self.generate_user('Test User', 'notarealemail@notarealplace.com')
        self.app.post('/user/register/', data=json.dumps(user))

        user_to_delete = DB.User.find_one({'email': 'notarealemail@notarealplace.com'})

        data = {
            'session_id': 'abcdefghijklmnopqrstuvwyzabcdef',
            'user_id': str(user_to_delete.get('_id'))
        }

        response = self.app.post('/user/delete/', data=json.dumps(data))
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data.get('success'), 'user ' + str(user_to_delete.get('_id')) + ' has been deleted')
        self.assertIsNone(DB.User.find_one({"email": "notarealemail@notarealplace.com"}))


    def test_admin_user_delete_existing(self):
        DB.Session.insert_one({
            'session_id': 'abcdefghijklmnopqrstuvwyzabcdeg',
            'email': 'notarealadminemail@notarealplace.com'
        })

        user = self.generate_user('Test User', 'notarealemail@notarealplace.com')
        self.app.post('/user/register/', data=json.dumps(user))

        user_to_delete = DB.User.find_one({'email': 'notarealemail@notarealplace.com'})

        admin = self.generate_user('Test Admin', 'notarealadminemail@notarealplace.com')
        self.app.post('/user/register/', data=json.dumps(admin))

        DB.User.find_one_and_update({'email': 'notarealadminemail@notarealplace.com'},
            {'$set': {'isAdmin': True}})

        data = {
            'session_id': 'abcdefghijklmnopqrstuvwyzabcdeg',
            'user_id': str(user_to_delete.get('_id'))
        }

        response = self.app.post('/user/delete/', data=json.dumps(data))
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data.get('success'), 'user ' + str(user_to_delete.get('_id')) + ' has been deleted')
        self.assertIsNone(DB.User.find_one({"email": "notarealemail@notarealplace.com"}))


    def test_user_update_existing(self):
        user = self.generate_user('Test User', 'test@test.com')
        self.app.post('/user/register/', data=json.dumps(user))
        data = {'name': "pass the test", 'genre': "Action", 'email': 'test@test.com'}

        response = self.app.post('/user/update/', data=json.dumps(data))
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data.get('success'), 'user test@test.com has been updated')
        self.assertEqual(DB.User.find_one({"email": "test@test.com"}).get('name'), "pass the test")

    def test_user_update_non_existing(self):
        user = self.generate_user('Test User', 'test@test.com')
        self.app.post('/user/register/', data=json.dumps(user))
        data = {'name': "fail the test", 'genre': "Action", 'email': 'test2@test.com'}

        response = self.app.post('/user/update/', data=json.dumps(data))
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data.get('error'), 'no user found to update')
        self.assertEqual(DB.User.find_one({"email": "test@test.com"}).get('genre'), "Horror")


    def test_admin_user_make_admin_existing(self):
        DB.Session.insert_one({
            'session_id': 'abcdefghijklmnopqrstuvwyzabcdeg',
            'email': 'notarealadminemail@notarealplace.com'
        })

        user = self.generate_user('Test User', 'notarealemail@notarealplace.com')
        self.app.post('/user/register/', data=json.dumps(user))

        user_to_make_admin = DB.User.find_one({'email': 'notarealemail@notarealplace.com'})

        admin = self.generate_user('Test Admin', 'notarealadminemail@notarealplace.com')
        self.app.post('/user/register/', data=json.dumps(admin))

        DB.User.find_one_and_update({'email': 'notarealadminemail@notarealplace.com'},
            {'$set': {'isAdmin': True}})

        data = {
            'session_id': 'abcdefghijklmnopqrstuvwyzabcdeg',
            'user_id': str(user_to_make_admin.get('_id'))
        }

        response = self.app.post('/user/make-admin/', data=json.dumps(data))
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data.get('success'), 'user ' + str(user_to_make_admin.get('_id')) + ' is now an admin')

    def test_admin_user_make_admin_not_existing(self):
        DB.Session.insert_one({
            'session_id': 'abcdefghijklmnopqrstuvwyzabcdeg',
            'email': 'notarealadminemail@notarealplace.com'
        })

        admin = self.generate_user('Test Admin', 'notarealadminemail@notarealplace.com')
        self.app.post('/user/register/', data=json.dumps(admin))

        DB.User.find_one_and_update({'email': 'notarealadminemail@notarealplace.com'},
            {'$set': {'isAdmin': True}})

        data = {
            'session_id': 'abcdefghijklmnopqrstuvwyzabcdeg',
            'user_id': '000000000000000000000000'
        }

        response = self.app.post('/user/make-admin/', data=json.dumps(data))
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data.get('error'), 'no user with this id exists')

    def test_admin_user_make_admin_no_session(self):
        DB.Session.insert_one({
            'session_id': 'abcdefghijklmnopqrstuvwyzabcdeg',
            'email': 'notarealadminemail@notarealplace.com'
        })

        user = self.generate_user('Test User', 'notarealemail@notarealplace.com')
        self.app.post('/user/register/', data=json.dumps(user))

        user_to_make_admin = DB.User.find_one({'email': 'notarealemail@notarealplace.com'})

        admin = self.generate_user('Test Admin', 'notarealadminemail@notarealplace.com')
        self.app.post('/user/register/', data=json.dumps(admin))

        DB.User.find_one_and_update({'email': 'notarealadminemail@notarealplace.com'},
            {'$set': {'isAdmin': True}})

        data = {
            'user_id': '000000000000000000000000'
        }

        response = self.app.post('/user/make-admin/', data=json.dumps(data))
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data.get('error'), 'must be logged in to make a user admin')

    def test_admin_user_make_admin_no_user_id(self):
        DB.Session.insert_one({
            'session_id': 'abcdefghijklmnopqrstuvwyzabcdeg',
            'email': 'notarealadminemail@notarealplace.com'
        })

        admin = self.generate_user('Test Admin', 'notarealadminemail@notarealplace.com')
        self.app.post('/user/register/', data=json.dumps(admin))

        DB.User.find_one_and_update({'email': 'notarealadminemail@notarealplace.com'},
            {'$set': {'isAdmin': True}})

        data = {
            'session_id': 'abcdefghijklmnopqrstuvwyzabcdeg'
        }

        response = self.app.post('/user/make-admin/', data=json.dumps(data))
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data.get('error'), 'user id is required')

    def test_non_admin_user_make_admin(self):
        DB.Session.insert_one({
            'session_id': 'abcdefghijklmnopqrstuvwyzabcdei',
            'email': 'notarealnotadminemail@notarealplace.com'
        })

        user = self.generate_user('Test User', 'notarealemail@notarealplace.com')
        self.app.post('/user/register/', data=json.dumps(user))

        user_to_make_admin = DB.User.find_one({'email': 'notarealemail@notarealplace.com'})

        not_admin = self.generate_user('Test Not Admin', 'notarealnotadminemail@notarealplace.com')
        self.app.post('/user/register/', data=json.dumps(not_admin))

        data = {
            'session_id': 'abcdefghijklmnopqrstuvwyzabcdei',
            'user_id': str(user_to_make_admin.get('_id'))
        }

        response = self.app.post('/user/make-admin/', data=json.dumps(data))
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 401)
        self.assertEqual(data.get('error'), 'you do not have permission to make admin')

    @staticmethod
    def generate_user(username, email):
        user = {
            'name': username,
            'email': email,
            'password': 'password',
            'age': 22,
            'genre': 'Horror'
        }
        return user

if __name__ == "__main__":
    unittest.main()