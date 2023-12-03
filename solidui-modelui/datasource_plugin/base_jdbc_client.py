import logging
from abc import ABC, abstractmethod


class BaseJdbcClient(ABC):

    def __init__(self, conn):
        self.conn = conn
        self.logger = logging.getLogger(__name__)

    def close_resource(self, connection, statement, result_set):
        try:
            if result_set is not None and not result_set.closed:
                result_set.close()
            if statement is not None and not statement.closed:
                statement.close()
            if connection is not None and not connection.closed:
                connection.close()
        except Exception as e:
            self.logger.warn(f"Failed to release resources: {e}")

    def close(self):
        self.close_resource(self.conn, None, None)

    @abstractmethod
    def generate_select_all_data_sql(self, database, table_name):
        pass

    @abstractmethod
    def get_all_databases(self):
        pass

    @abstractmethod
    def get_all_tables(self, database):
        pass

    @abstractmethod
    def get_select_result(self, sql):
        pass

    def get_conn(self):
        return self.conn