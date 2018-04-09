import unittest

from bson.json_util import dumps, loads

from app import APP, DB
from models import Logs

class LogsTest(unittest.TestCase):
    def setUp(self):
        APP.config['TESTING'] = True
        APP.config['WTF_CSRF_ENABLED'] = False
        self.app = APP.test_client()
        DB.Logs.delete_many({})
        DB.User.delete_many({})
        DB.Session.delete_many({})

        log = Logs('test', dumps({'log': 'test log'}), 200)
        log.create()

        DB.User.insert_one({
            'name': 'Admin',
            'email': 'admin@admin.com',
            'password': 'password',
            'age': 22,
            'genre': 'Horror',
            'isAdmin': True
        })
        DB.Session.insert_one({
            'session_id': 'admin',
            'email': 'admin@admin.com'
        })

        DB.User.insert_one({
            'name': 'User',
            'email': 'user@user.com',
            'password': 'password',
            'age': 22,
            'genre': 'Horror',
            'isAdmin': False
        })        
        DB.Session.insert_one({
            'session_id': 'notadmin',
            'email': 'user@user.com'
        })

    def tearDown(self):
        DB.User.delete_many({})
        DB.Logs.delete_many({})
        DB.Session.delete_many({})
    
    def test_get_logs_no_session(self):
        response = self.app.post('/logs/', data=dumps({'sessionId':''}))
        data = loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data.get('error'), 'must be logged in to view logs')
    
    def test_get_logs_not_admin(self):
        data = {
            'session_id': 'notadmin'
        }
        response = self.app.post('/logs/', data=dumps(data))
        data = loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 401)
        self.assertEqual(data.get('error'), 'you do not have permission to view logs')
    
    def test_get_logs(self):
        data = {
            'session_id': 'admin'
        }
        response = self.app.post('/logs/', data=dumps(data))
        data = loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 200)
        self.assertNotEqual(data, None)

    
    def test_clear_logs_no_session(self):
        data = {
            'session_id': ''
        }
        response = self.app.post('/logs/clear/', data=dumps(data))
        data = loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data.get('error'), 'must be logged in to clear logs')

    def test_clear_logs_not_admin(self):
        data = {
            'session_id': 'notadmin'
        }
        response = self.app.post('/logs/clear/', data=dumps(data))
        data = loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 401)
        self.assertEqual(data.get('error'), 'you do not have permission to clear logs')

    def test_clear_logs(self):
        data = {
            'session_id': 'admin'
        }
        num_logs = DB.Logs.count({})
        response = self.app.post('/logs/clear/', data=dumps(data))
        data = loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data.get('success'), 'all logs deleted')
        self.assertEqual(data.get('logs_deleted'), num_logs)
        self.assertEqual(DB.Logs.count({}), 0)
        # make sure we didn't clear any other parts of the DB
        self.assertNotEqual(DB.User.count({}), 0)
        self.assertNotEqual(DB.Session.count({}), 0)