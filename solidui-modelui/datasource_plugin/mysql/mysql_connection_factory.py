import mysql.connector

from .connection_factory import ConnectionFactory

class MysqlConnectionFactory(ConnectionFactory):

    def open_connection(self, host, port, username, password, database, extra_params):
        conn = mysql.connector.connect(
            host=host,
            port=port,
            user=username,
            password=password,
            database=database,
            **extra_params
        )
        return conn

    def get_name(self):
        return "mysql"