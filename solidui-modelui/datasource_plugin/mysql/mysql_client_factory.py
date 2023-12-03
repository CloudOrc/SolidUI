import mysql.connector

from .base_jdbc_client_factory import BaseJdbcClientFactory
from .mysql_client import MysqlClient

class MysqlClientFactory(BaseJdbcClientFactory):

    def create_jdbc_client(self, connect_dto):
        conn = mysql.connector.connect(
            host=connect_dto.host,
            port=connect_dto.port,
            user=connect_dto.username,
            password=connect_dto.password,
            database=connect_dto.database,
            **connect_dto.extra_params
        )
        return MysqlClient(conn)