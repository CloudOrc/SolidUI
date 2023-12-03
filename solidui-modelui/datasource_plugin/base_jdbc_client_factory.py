from abc import ABC, abstractmethod

from .constants import *
from .connect_dto import ConnectDTO

class BaseJdbcClientFactory(ABC):

    def get_connect_dto(self, conn_params):
        connect_dto = ConnectDTO()
        connect_dto.host = conn_params.get(PARAM_SQL_HOST)
        connect_dto.port = conn_params.get(PARAM_SQL_PORT)
        connect_dto.username = conn_params.get(PARAM_SQL_USERNAME)
        connect_dto.password = conn_params.get(PARAM_SQL_PASSWORD)
        connect_dto.database = conn_params.get(PARAM_SQL_DATABASE)
        extra_params = conn_params.get(PARAM_SQL_EXTRA_PARAMS)
        if extra_params is None:
            connect_dto.extra_params = {}
        else:
            connect_dto.extra_params = extra_params
        return connect_dto

    @abstractmethod
    def create_jdbc_client(self, connect_dto):
        pass