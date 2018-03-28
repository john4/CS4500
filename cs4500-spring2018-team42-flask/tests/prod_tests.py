"""tests involving movie reviews"""

import json
import unittest
import datetime

from app import APP, DB
from models import Prod

class ProdTest(unittest.TestCase):
    def setUp(self):
        APP.config['TESTING'] = True
        APP.config['WTF_CSRF_ENABLED'] = False
        self.app = APP.test_client()

        DB.Prod.delete_many({})

        DB.User.insert_one({
            'name': 'Alice',
            'email': 'yes@yes.com',
            'password': 'mypassword',
            'age': 22
        })

        DB.User.insert_one({
            'name': 'Bob',
            'email': 'no@no.com',
            'password': 'mypassword',
            'age': 22
        })

        DB.User.insert_one({
            'name': 'Charlie',
            'email': 'me@me.com',
            'password': 'mypassword',
            'age': 22
        })

        DB.Session.insert_one({
            'session_id': 'abcdefghijklmnopqrstuvwyzabcdef',
            'email': 'yes@yes.com'
        })

    def tearDown(self):
        DB.Prod.delete_many({})

    def test_prod_not_logged_in(self):
        alice = DB.User.find_one({'email': 'yes@yes.com'})
        bob = DB.User.find_one({'email': 'no@no.com'})

        data = {
            'sender': str(alice.get('_id')),
            'receivers': [str(bob.get('_id'))],
            'tmdb_id': 4,
            'message': 'this movie was great!'
        }

        response = self.app.post('/user/prod/', data=json.dumps(data))
        data = json.loads(response.get_data(as_text=True))

        self.assertEqual(response.status_code, 400)
        self.assertEqual(data.get('error'), 'must be logged in to prod')

    def test_prod_missing_data(self):
        alice = DB.User.find_one({'email': 'yes@yes.com'})
        bob = DB.User.find_one({'email': 'no@no.com'})

        data = {
            'sender': str(alice.get('_id')),
            'receivers': [str(bob.get('_id'))],
            'message': 'this movie was great!',
            'session_id': 'abcdefghijklmnopqrstuvwyzabcdef'
        }

        response = self.app.post('/user/prod/', data=json.dumps(data))
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data.get('error'), 'sender, receiver, and tmdb id required for prod')

        data = {
            'sender': str(alice.get('_id')),
            'message': 'this movie was great!',
            'tmdb_id': 4,
            'session_id': 'abcdefghijklmnopqrstuvwyzabcdef'
        }

        response = self.app.post('/user/prod/', data=json.dumps(data))
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data.get('error'), 'sender, receiver, and tmdb id required for prod')

        data = {
            'message': 'this movie was great!',
            'session_id': 'abcdefghijklmnopqrstuvwyzabcdef'
        }

        response = self.app.post('/user/prod/', data=json.dumps(data))
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data.get('error'), 'sender, receiver, and tmdb id required for prod')

    def test_mark_read(self):
        alice = DB.User.find_one({'email': 'yes@yes.com'})
        bob = DB.User.find_one({'email': 'no@no.com'})

        data = {
            'sender': str(alice.get('_id')),
            'receivers': [str(bob.get('_id'))],
            'tmdb_id': 4,
            'message': 'this movie was great!',
            'read': False,
            'timestamp': datetime.datetime.utcnow()
        }

        DB.Prod.insert_one(data)
        prod = DB.Prod.find_one({'sender': str(alice.get('_id'))})

        prod_data = {
            'prod_id': str(prod.get('_id'))
        }

        response = self.app.post('/user/prod/mark-read/', data=json.dumps(prod_data))
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 200)

        prod = DB.Prod.find_one({'sender': str(alice.get('_id'))})
        self.assertTrue(prod.get('read'))

        DB.Prod.find_one_and_delete({'sender': str(alice.get('_id'))})

        response = self.app.post('/user/prod/mark-read/', data=json.dumps(prod_data))
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data.get('error'), 'prod does not exist')

    def test_prod_multiple_and_get(self):
        alice = DB.User.find_one({'email': 'yes@yes.com'})
        bob = DB.User.find_one({'email': 'no@no.com'})
        charlie = DB.User.find_one({'email': 'me@me.com'})

        data = {
            'sender': str(alice.get('_id')),
            'receivers': [str(bob.get('_id')), str(charlie.get('_id'))],
            'tmdb_id': 25,
            'message': 'best movie ever',
            'session_id': 'abcdefghijklmnopqrstuvwyzabcdef'
        }

        response = self.app.post('/user/prod/', data=json.dumps(data))
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 200)

        data = {
            'user_id': str(bob.get('_id'))
        }

        response = self.app.post('/user/prod/get-all/', data=json.dumps(data))
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(data), 1)


if __name__ == "__main__":
    unittest.main()
