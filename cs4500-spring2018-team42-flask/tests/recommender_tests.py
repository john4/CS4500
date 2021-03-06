"""VERY basic test for the recommender"""

import json
import unittest

from app import APP, DB
from models import Recommender, Review, User
from bson.json_util import dumps
from bson.objectid import ObjectId

class MovieReviewTest(unittest.TestCase):
    def setUp(self):
        APP.config['TESTING'] = True
        APP.config['WTF_CSRF_ENABLED'] = False
        self.app = APP.test_client()

        DB.Review.delete_many({})
        DB.User.delete_many({})

        DB.User.insert_one({
            'name': 'One',
            'email': 'one@one.one'
        })

        DB.User.insert_one({
            'name': 'Two',
            'email': 'two@two.two'
        })

        DB.User.insert_one({
            'name': 'Three',
            'email': 'three@three.three'
        })

        DB.User.insert_one({
            'name': 'Four',
            'email': 'four@four.four'
        })

        self.user_one = DB.User.find_one({'email': 'one@one.one'})
        self.user_two = DB.User.find_one({'email': 'two@two.two'})
        self.user_three = DB.User.find_one({'email': 'three@three.three'})
        self.user_four = DB.User.find_one({'email': 'four@four.four'})

        DB.Review.insert_one({
            'tmdb_id': 1,
            'user_id': str(self.user_one.get('_id')),
            'rating': 5
        })

        DB.Review.insert_one({
            'tmdb_id': 2,
            'user_id': str(self.user_one.get('_id')),
            'rating': 5
        })

        DB.Review.insert_one({
            'tmdb_id': 1,
            'user_id': str(self.user_two.get('_id')),
            'rating': 5
        })

        DB.Review.insert_one({
            'tmdb_id': 1,
            'user_id': str(self.user_three.get('_id')),
            'rating': 1
        })

        DB.Review.insert_one({
            'tmdb_id': 3,
            'user_id': str(self.user_three.get('_id')),
            'rating': 5
        })

    def tearDown(self):
        DB.Review.delete_many({})
        DB.User.delete_many({})

    def test_recommender(self):
        response = self.app.get('/user/{}/recommender/'.format(str(self.user_two.get('_id'))))
        data = json.loads(response.get_data(as_text=True))
        data = [item.get('id') for item in data]
        self.assertEqual(data, [2, 3])

    def test_bad_user(self):
        response = self.app.get('/user/{}/recommender/'.format('hello'))
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data.get('error'), 'invalid user_id')

    def test_user_no_reviews(self):
        response = self.app.get('/user/{}/recommender/'.format(str(self.user_four.get('_id'))))
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(len(data), 0)

if __name__ == "__main__":
    unittest.main()
