"""tests involving movie reviews"""

import json
import unittest

from app import APP, DB
from models import Movie, Review

class MovieReviewTest(unittest.TestCase):
    def setUp(self):
        APP.config['TESTING'] = True
        APP.config['WTF_CSRF_ENABLED'] = False
        APP.config['DEBUG'] = False
        self.app = APP.test_client()
        self.assertEqual(APP.debug, False)
        DB.Review.delete_many({})

    def tearDown(self):
        pass

    def test_add_review(self):
        data = {
            'user_email': 'notarealemail@notarealplace.com',
            'rating': 5
        }

        response = self.app.post('/movie/1234/review/', data=json.dumps(data))
        data = json.loads(response.get_data(as_text=True))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(data.get('tmdb_id'), 1234)
        self.assertEqual(data.get('user_email'), 'notarealemail@notarealplace.com')
        self.assertEqual(data.get('rating'), 5)

    def test_add_duplicate_review(self):
        data = {
            'user_email': 'notarealemail@notarealplace.com',
            'rating': 5
        }

        response = self.app.post('/movie/1234/review/', data=json.dumps(data))
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 200)

        response = self.app.post('/movie/1234/review/', data=json.dumps(data))
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data.get('error'), 'trying to create a duplicate review')

    def test_avg_rating(self):
        response = self.app.get('/movie/1234/rating/')
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data.get('avg_rating'), 0)

        data = {
            'user_email': 'notarealemail@notarealplace.com',
            'rating': 5
        }

        response = self.app.post('/movie/1234/review/', data=json.dumps(data))
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 200)

        response = self.app.get('/movie/1234/rating/')
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data.get('avg_rating'), 5)

        data = {
            'user_email': 'notarealemail2@notarealplace.com',
            'rating': 1
        }

        response = self.app.post('/movie/1234/review/', data=json.dumps(data))
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 200)

        response = self.app.get('/movie/1234/rating/')
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data.get('avg_rating'), 3)


if __name__ == "__main__":
    unittest.main()
