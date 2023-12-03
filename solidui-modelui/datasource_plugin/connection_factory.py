from .plugin import Plugin
from abc import ABC, abstractmethod

class ConnectionFactory(Plugin, ABC):

    @abstractmethod
    def open_connection(self, host, port, username, password, database, extra_params):
        pass