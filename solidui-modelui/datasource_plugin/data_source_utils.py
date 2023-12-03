import importlib
from types import ModuleType

from constants import DATASOURCE_TYPE_LIST, DATASOURCE_CLASSNAME_FORMAT


class DataSourceUtils:
    jdbc_client_factory_instances = {}

    @staticmethod
    def query_jdbc_client_factory(type_name):

        if type_name not in DATASOURCE_TYPE_LIST:
            raise ValueError(f"{type_name} is not supported")

        factory = DataSourceUtils.jdbc_client_factory_instances.get(type_name)
        if factory is None:
            class_name = DATASOURCE_CLASSNAME_FORMAT % type_name
            module_name = class_name.rsplit(".", 1)[0]
            factory_cls = getattr(importlib.import_module(module_name), class_name.split(".")[-1])
            factory = factory_cls()
            DataSourceUtils.jdbc_client_factory_instances[type_name] = factory

        return factory

    @staticmethod
    def query_jdbc_client(type_name, data_source):

        factory = DataSourceUtils.query_jdbc_client_factory(type_name)

        connect_dto = factory.get_connect_dto(data_source.params)

        if connect_dto:
            return factory.create_jdbc_client(connect_dto)