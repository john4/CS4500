"""tests involving movie reviews"""

import json
import unittest

from app import APP, DB
from models import Movie, Review

class MovieReviewTest(unittest.TestCase):
    def setUp(self):
        APP.config['TESTING'] = True
        APP.config['WTF_CSRF_ENABLED'] = False
        self.app = APP.test_client()

        DB.Review.delete_many({})
        DB.Session.delete_many({})

        DB.Session.insert_one({
            'session_id': 'abcdefghijklmnopqrstuvwyzabcdef',
            'email': 'notarealemail@notarealplace.com'
        })

        DB.Session.insert_one({
            'session_id': 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
            'email': 'yes@yes.com'
        })

        DB.Session.insert_one({
            'session_id': 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
            'email': 'no@no.com'
        })

    def tearDown(self):
        DB.Review.delete_many({})
        DB.Session.delete_many({})

    def test_review_not_logged_in(self):
        data = {
            'user_email': 'notarealemail@notarealplace.com',
            'rating': 5
        }

        response = self.app.post('/movie/1234/review/', data=json.dumps(data))
        data = json.loads(response.get_data(as_text=True))

        self.assertEqual(response.status_code, 400)
        self.assertEqual(data.get('error'), 'must be logged in to review')

    def test_add_review(self):
        data = {
            'user_email': 'notarealemail@notarealplace.com',
            'rating': 5,
            'session_id': 'abcdefghijklmnopqrstuvwyzabcdef',
            'description': 'this movie sucked'
        }

        response = self.app.post('/movie/1234/review/', data=json.dumps(data))
        data = json.loads(response.get_data(as_text=True))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(data.get('tmdb_id'), 1234)
        self.assertEqual(data.get('user_email'), 'notarealemail@notarealplace.com')
        self.assertEqual(data.get('rating'), 5)
        self.assertEqual(data.get('description'), 'this movie sucked')

    def test_add_duplicate_review(self):
        data = {
            'user_email': 'notarealemail@notarealplace.com',
            'rating': 5,
            'session_id': 'abcdefghijklmnopqrstuvwyzabcdef'
        }

        response = self.app.post('/movie/1234/review/', data=json.dumps(data))
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 200)

        data = {
            'user_email': 'notarealemail@notarealplace.com',
            'rating': 5,
            'session_id': 'abcdefghijklmnopqrstuvwyzabcdef'
        }

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
            'rating': 5,
            'session_id': 'abcdefghijklmnopqrstuvwyzabcdef'
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
            'rating': 1,
            'session_id': 'abcdefghijklmnopqrstuvwyzabcdef'
        }

        response = self.app.post('/movie/1234/review/', data=json.dumps(data))
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 200)

        response = self.app.get('/movie/1234/rating/')
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data.get('avg_rating'), 3)

    def test_get_reviews(self):
        review_one = {
            'user_email': 'notarealemail@notarealplace.com',
            'rating': 3,
            'session_id': 'abcdefghijklmnopqrstuvwyzabcdef',
            'description': 'this movie was ok'
        }

        review_two = {
            'user_email': 'yes@yes.com',
            'rating': 5,
            'session_id': 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
            'description': 'this movie was great'
        }

        review_three = {
            'user_email': 'no@no.com',
            'rating': 1,
            'session_id': 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
            'description': 'this movie was bad'
        }

        response = self.app.post('/movie/1234/review/', data=json.dumps(review_one))
        self.assertEqual(response.status_code, 200)

        response = self.app.post('/movie/1234/review/', data=json.dumps(review_two))
        self.assertEqual(response.status_code, 200)

        response = self.app.post('/movie/1234/review/', data=json.dumps(review_three))
        self.assertEqual(response.status_code, 200)

        response = self.app.get('/movie/1234/get-reviews/')
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(data), 3)
        self.assertIsNotNone(data[0].get('description'))
        self.assertIsNotNone(data[0].get('rating'))
        self.assertIsNotNone(data[0].get('user_email'))

    def test_get_reviews_none(self):
        response = self.app.get('/movie/12/get-reviews/')
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(data), 0)

    def test_delete_review(self):
        data = {
            'user_email': 'notarealemail@notarealplace.com',
            'rating': 5,
            'session_id': 'abcdefghijklmnopqrstuvwyzabcdef',
            'description': 'this movie sucked'
        }

        response = self.app.post('/movie/1234/review/', data=json.dumps(data))
        self.assertEqual(response.status_code, 200)

        response = self.app.get('/movie/1234/get-reviews/')
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(data), 1)

        review_id = data[0].get('_id').get('$oid')

        data = {
            'session_id': 'abcdefghijklmnopqrstuvwyzabcdef',
            'review_id': review_id
        }

        response = self.app.post('/movie/1234/delete-review/', data=json.dumps(data))
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(review_id, data.get('review_data').get('_id').get('$oid'))

    def test_delete_review_does_not_exist(self):
        data = {
            'session_id': 'abcdefghijklmnopqrstuvwyzabcdef',
            'review_id': '5ab699f15ee07b115a50aab0'
        }

        response = self.app.post('/movie/1234/delete-review/', data=json.dumps(data))
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data.get('error'), 'review does not exist')

if __name__ == "__main__":
    unittest.main()
