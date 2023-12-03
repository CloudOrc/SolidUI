import importlib

class JdbcClientManager:

    @staticmethod
    def load_connection_factory(class_name):
        parts = class_name.rsplit('.', 1)
        module = importlib.import_module(parts[0])
        connection_factory_cls = getattr(module, parts[1])
        return connection_factory_cls()