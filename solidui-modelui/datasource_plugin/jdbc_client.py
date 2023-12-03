
from abc import ABC, abstractmethod

class JdbcClient(ABC):

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

    @abstractmethod
    def close(self):
        pass

    @abstractmethod
    def get_conn(self):
        pass