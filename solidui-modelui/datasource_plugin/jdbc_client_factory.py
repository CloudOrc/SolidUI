from abc import ABC, abstractmethod

class JdbcClientFactory(ABC):

    @abstractmethod
    def create_jdbc_client(self, connect_dto):
        pass

    @abstractmethod
    def get_connect_dto(self, conn_params):
        pass