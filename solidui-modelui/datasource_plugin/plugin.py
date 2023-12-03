from abc import ABC, abstractmethod

class Plugin(ABC):

    @abstractmethod
    def get_name(self):
        pass
