import unittest

from bson.json_util import dumps, loads

from app import APP, DB
from models import User

class FollowTest(unittest.TestCase):
    def setUp(self):
        APP.config['TESTING'] = True
        APP.config['WTF_CSRF_ENABLED'] = False
        self.app = APP.test_client()
        DB.Logs.delete_many({})

        DB.Session.insert_one({
            'session_id': 'abcdefghijklmnopqrstuvwyzabcdef',
            'email': 'notarealemail@notarealplace.com'
        })

        DB.User.insert_one({
            'name': 'Test User',
            'email': 'notarealemail@notarealplace.com',
            'password': 'root',
            'age': 22,
            'genre': ['Mystery', 'Horror']
        })

        DB.User.insert_one({
            'name': 'Test User2',
            'email': 'notarealemail2@notarealplace.com',
            'password': 'root',
            'age': 22,
            'genre': ['Mystery', 'Horror']
        })

        DB.User.insert_one({
            'name': 'weird name',
            'email': 'notarealemail3@notarealplace.com',
            'password': 'root',
            'age': 22,
            'genre': ['Mystery', 'Horror']
        })

    def tearDown(self):
        DB.Session.delete_many({})
        DB.User.delete_many({})
        DB.Logs.delete_many({})

    def follow_setup(self):
        user_to_add =  DB.User.find_one({"email": 'notarealemail2@notarealplace.com'})
        session_one = User.check_session('abcdefghijklmnopqrstuvwyzabcdef')

        if session_one:
            data = {
                'session_id': 'abcdefghijklmnopqrstuvwyzabcdef',
                'oid': user_to_add.get('_id')
            }

        response = self.app.post('/user/follow/', data=dumps(data))
        data = loads(response.get_data(as_text=True))

        user_after_add =  DB.User.find_one({"email": 'notarealemail@notarealplace.com'}, projection={'password':False})
        user_added_after_add =  DB.User.find_one({"email": 'notarealemail2@notarealplace.com'}, projection={'password':False})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(data.get('success'), 'user notarealemail@notarealplace.com is following the user')
        self.assertTrue(user_added_after_add.get('_id') in user_after_add.get("iFollow"))
        self.assertTrue(user_after_add.get('_id') in user_added_after_add.get("followMe"))

        return user_after_add, user_added_after_add

    def test_user_follow(self):
        user_to_add =  DB.User.find_one({"email": 'notarealemail2@notarealplace.com'})
        session_one = User.check_session('abcdefghijklmnopqrstuvwyzabcdef')

        if session_one:
            data = {
                'session_id': 'abcdefghijklmnopqrstuvwyzabcdef',
                'oid': user_to_add.get('_id')
            }

        response = self.app.post('/user/follow/', data=dumps(data))
        data = loads(response.get_data(as_text=True))

        user_after_add =  DB.User.find_one({"email": 'notarealemail@notarealplace.com'})
        user_added_after_add =  DB.User.find_one({"email": 'notarealemail2@notarealplace.com'})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(data.get('success'), 'user notarealemail@notarealplace.com is following the user')
        self.assertTrue(user_added_after_add.get('_id') in user_after_add.get("iFollow"))
        self.assertTrue(user_after_add.get('_id') in user_added_after_add.get("followMe"))

    def test_user_follow_no_session(self):
        user_to_add =  DB.User.find_one({"email": 'notarealemail2@notarealplace.com'})

        data = {
            'oid': user_to_add.get('_id')
        }

        response = self.app.post('/user/follow/', data=dumps(data))
        data = loads(response.get_data(as_text=True))

        self.assertEqual(response.status_code, 400)
        self.assertEqual(data.get('error'), 'must be logged in to follow')

    def test_user_already_follow(self):
        user_to_add =  DB.User.find_one({"email": 'notarealemail2@notarealplace.com'})
        session_one = User.check_session('abcdefghijklmnopqrstuvwyzabcdef')

        if session_one:
            data = {
                'session_id': 'abcdefghijklmnopqrstuvwyzabcdef',
                'oid': user_to_add.get('_id')
            }

        response = self.app.post('/user/follow/', data=dumps(data))
        response = self.app.post('/user/follow/', data=dumps(data))
        data = loads(response.get_data(as_text=True))

        self.assertEqual(response.status_code, 400)
        self.assertEqual(data.get('error'), "You are already following this user")


    def test_user_doesnt_exist_follow(self):
        session_one = User.check_session('abcdefghijklmnopqrstuvwyzabcdef')

        if session_one:
            data = {
                'session_id': 'abcdefghijklmnopqrstuvwyzabcdef',
                'oid': {'$oid': '000000000000000000000000'}
            }

        response = self.app.post('/user/follow/', data=dumps(data))
        data = loads(response.get_data(as_text=True))

        self.assertEqual(response.status_code, 400)
        self.assertEqual(data.get('error'), "A user with that id does not exist")

    def test_user_unfollow(self):
        me, other = FollowTest.follow_setup(self)

        session_one = User.check_session('abcdefghijklmnopqrstuvwyzabcdef')

        if session_one:
            data = {
                'session_id': 'abcdefghijklmnopqrstuvwyzabcdef',
                'oid': other.get('_id')
            }

        response = self.app.post('/user/unfollow/', data=dumps(data))
        data = loads(response.get_data(as_text=True))

        user_after_remove =  DB.User.find_one({"email": 'notarealemail@notarealplace.com'})
        user_removed_after_remove =  DB.User.find_one({"email": 'notarealemail2@notarealplace.com'})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(data.get('success'), 'user notarealemail@notarealplace.com is no longer following the user')
        self.assertTrue(user_removed_after_remove.get('_id') not in user_after_remove.get("iFollow"))
        self.assertTrue(user_after_remove.get('_id') not in user_removed_after_remove.get("followMe"))

    def test_user_doesnt_exist_unfollow(self):
        session_one = User.check_session('abcdefghijklmnopqrstuvwyzabcdef')

        if session_one:
            data = {
                'session_id': 'abcdefghijklmnopqrstuvwyzabcdef',
                'oid': {'$oid': '000000000000000000000000'}
            }

        response = self.app.post('/user/unfollow/', data=dumps(data))
        data = loads(response.get_data(as_text=True))

        self.assertEqual(response.status_code, 400)
        self.assertEqual(data.get('error'), "A user with that id does not exist")

    def test_user_no_following_unfollow(self):
        me, other = FollowTest.follow_setup(self)

        user_to_add =  DB.User.find_one({"email": 'notarealemail3@notarealplace.com'})
        session_one = User.check_session('abcdefghijklmnopqrstuvwyzabcdef')

        if session_one:
            data = {
                'session_id': 'abcdefghijklmnopqrstuvwyzabcdef',
                'oid': user_to_add.get('_id')
            }

        response = self.app.post('/user/unfollow/', data=dumps(data))
        data = loads(response.get_data(as_text=True))

        self.assertEqual(response.status_code, 400)
        self.assertEqual(data.get('error'), "You are not following this user")

    def test_find_user(self):
        response = self.app.get('/user/search/?name=User')
        data = loads(response.get_data(as_text=True))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(data), 2)

        DB.User.insert_one({
            'name': 'New User four',
            'email': 'notarealemail4@notarealplace.com',
            'password': 'root',
            'age': 22,
            'genre': ['Mystery', 'Horror']
        })

        response = self.app.get('/user/search/?name=User')
        data = loads(response.get_data(as_text=True))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(data), 3)

    def test_fail_find_user(self):
        response = self.app.get('/user/search/?name=not%20real')
        data = loads(response.get_data(as_text=True))

        self.assertEqual(response.status_code, 400)
        self.assertEqual(data.get('error'), "no user with this name exists")

    def test_follow_me_get_all(self):
        me, other = FollowTest.follow_setup(self)

        session_one = User.check_session('abcdefghijklmnopqrstuvwyzabcdef')

        if session_one:
            data = {
                'session_id': 'abcdefghijklmnopqrstuvwyzabcdef',
                'user_id': str(other.get('_id'))
            }

        response = self.app.post('/user/follow-me/', data=dumps(data))
        data = loads(response.get_data(as_text=True))

        self.assertEqual(response.status_code, 200)
        self.assertIn(me, data)

    def test_follow_me_get_all_no_user(self):
        me, other = FollowTest.follow_setup(self)

        session_one = User.check_session('abcdefghijklmnopqrstuvwyzabcdef')

        if session_one:
            data = {
                'session_id': 'abcdefghijklmnopqrstuvwyzabcdef',
                'user_id': '000000000000000000000000'
            }

        response = self.app.post('/user/follow-me/', data=dumps(data))
        data = loads(response.get_data(as_text=True))

        self.assertEqual(response.status_code, 400)
        self.assertEqual(data.get('error'), "A user with that id does not exist")

    def test_follow_me_get_all_no_session(self):
        me, other = FollowTest.follow_setup(self)

        session_one = User.check_session('abcdefghijklmnopqrstuvwyzabcdef')

        if session_one:
            data = {
                'user_id': str(other.get('_id'))
            }

        response = self.app.post('/user/follow-me/', data=dumps(data))
        data = loads(response.get_data(as_text=True))

        self.assertEqual(response.status_code, 400)
        self.assertEqual(data.get('error'), "must be logged in to view followers")

    def test_i_follow_get_all(self):
        me, other = FollowTest.follow_setup(self)

        session_one = User.check_session('abcdefghijklmnopqrstuvwyzabcdef')

        if session_one:
            data = {
                'session_id': 'abcdefghijklmnopqrstuvwyzabcdef',
                'user_id': str(me.get('_id'))
            }

        response = self.app.post('/user/i-follow/', data=dumps(data))
        data = loads(response.get_data(as_text=True))

        self.assertEqual(response.status_code, 200)
        self.assertIn(other, data)

    def test_i_follow_get_all_no_user(self):
        me, other = FollowTest.follow_setup(self)

        session_one = User.check_session('abcdefghijklmnopqrstuvwyzabcdef')

        if session_one:
            data = {
                'session_id': 'abcdefghijklmnopqrstuvwyzabcdef',
                'user_id': '000000000000000000000000'
            }

        response = self.app.post('/user/i-follow/', data=dumps(data))
        data = loads(response.get_data(as_text=True))

        self.assertEqual(response.status_code, 400)
        self.assertEqual(data.get('error'), "A user with that id does not exist")

    def test_i_follow_get_all_no_session(self):
        me, other = FollowTest.follow_setup(self)

        session_one = User.check_session('abcdefghijklmnopqrstuvwyzabcdef')

        if session_one:
            data = {
                'user_id': str(me.get('_id'))
            }

        response = self.app.post('/user/i-follow/', data=dumps(data))
        data = loads(response.get_data(as_text=True))

        self.assertEqual(response.status_code, 400)
        self.assertEqual(data.get('error'), "must be logged in to view followers")
