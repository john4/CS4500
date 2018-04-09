""" LOG """
import datetime
from app import DB


class Logs(object):
    """
    Represents a log for logging purposes
    """

    def __init__(self, method, response, response_status, message=None):
        self.method = method
        self.response = response
        self.response_status = response_status
        self.message = message or ''

        self.timestamp = datetime.datetime.utcnow()

    def create(self):
        """
        Create an instance of a log
        """

        DB.Logs.insert_one(self.__dict__)
        return self.__dict__, 200

    @staticmethod
    def get_all():
        """
        Get all logs
        """

        logs = DB.Logs.find({})
        return list(logs), 200

    @staticmethod
    def clear_all():
        """
        Clear all logs
        """

        result = DB.Logs.delete_many({})
        return_data = {
            'success': 'all logs deleted',
            'logs_deleted': result.deleted_count
        }
        return return_data, 200
