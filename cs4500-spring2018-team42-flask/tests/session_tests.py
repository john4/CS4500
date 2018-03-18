"""tests involving user sessions"""

import unittest

from app import APP, DB
from models import User

class SessionTest(unittest.TestCase):
    def setUp(self):
        APP.config['TESTING'] = True
        APP.config['WTF_CSRF_ENABLED'] = False
        self.app = APP.test_client()

        DB.Session.insert_one({
            'session_id': 'abcdefghijklmnopqrstuvwyzabcdef',
            'email': 'notarealemail@notarealplace.com'
        })

    def tearDown(self):
        DB.Session.delete_many({})


    def test_check_session(self):
        session_one = User.check_session('abcdefghijklmnopqrstuvwyzabcdef')
        self.assertTrue(session_one)

        session_two = User.check_session('slfsjdlkjsdf')
        self.assertFalse(session_two)

    def test_end_session(self):
        result, response_code = User.end_session('abcdefghijklmnopqrstuvwyzabcdef')
        session = User.check_session('abcdefghijklmnopqrstuvwyzabcdef')
        self.assertFalse(session)
        self.assertEqual(response_code, 200)
        self.assertEqual(result.get('success'), 'session deleted')
        self.assertEqual(result.get('session_id'), 'abcdefghijklmnopqrstuvwyzabcdef')

        result, response_code = User.end_session('abcdefghijklmnopqrstuvwyzabcdef')
        session = User.check_session('abcdefghijklmnopqrstuvwyzabcdef')
        self.assertFalse(session)
        self.assertEqual(response_code, 400)
        self.assertEqual(result.get('error'), 'session does not exist')
        self.assertEqual(result.get('session_id'), 'abcdefghijklmnopqrstuvwyzabcdef')


if __name__ == "__main__":
    unittest.main()
