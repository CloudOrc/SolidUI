from dataclasses import dataclass
from typing import List, Dict, ClassVar
from datetime import datetime


@dataclass
class DataSource:
    id: int = None
    data_source_name: str = None
    data_source_desc: str = None
    data_source_type_id: int = None
    create_identify: str = None
    parameter: str = None
    create_time: datetime = None
    create_user: str = None
    labels: str = None
    expire: bool = False


@dataclass
class DataSourceType:
    id: str = None
    name: str = None
    description: str = None
    option: str = None
    classifier: str = None
    icon: str = None
    layers: int = 0


@dataclass
class DataSourceTypeKey:
    class ValueType:
        EMAIL = str
        TEXT = str
        TEXTAREA = str
        NUMBER = int
        SELECT = str
        LIST = List
        MAP = Dict
        RADIO = str
        PASSWORD = str
        DATE = datetime
        FILE = None

    class Scope:
        ENV = 'env'

    id: int = None
    data_source_type_id: int = None
    key: str = None
    description: str = None
    description_en: str = None
    name: str = None
    name_en: str = None
    default_value: str = None
    value_type: ValueType = None
    scope: Scope = None
    require: bool = False
    value_regex: str = None


@dataclass
class JobElement:
    id: int = None
    project_id: int = None
    name: str = None
    data: str = None
    data_type: str = None
    create_time: datetime = None
    update_time: datetime = None


@dataclass
class JobElementPage:
    id: int = None
    job_page_id: int = None
    job_element_id: int = None
    position: str = None
    create_time: datetime = None
    update_time: datetime = None


@dataclass
class JobPage:
    id: int = None
    project_id: int = None
    name: str = None
    parent_id: int = None
    layout: int = None
    orders: int = None
    create_time: datetime = None
    update_time: datetime = None


@dataclass
class ModelType:
    id: int = None
    name: str = None
    code: str = None
    type_name: str = None
    prompt: str = None
    token: str = None
    baseurl: str = None


@dataclass
class Project:
    id: int = None
    user_name: str = None
    project_name: str = None
    image: str = None
    description: str = None
    create_time: datetime = None
    update_time: datetime = None
    status: int = None


@dataclass
class User:
    id: int = None
    user_name: str = None
    user_password: str = None
    queue: str = None
    create_time: datetime = None
    update_time: datetime = None