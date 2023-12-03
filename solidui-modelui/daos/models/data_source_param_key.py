from sqlalchemy import Column, Integer, String, Boolean, DateTime

from .base import Base

class DataSourceParamKey(Base):

    __tablename__ = 'data_source_param_key'

    id = Column(Integer, primary_key=True)
    type_id = Column(Integer)
    key = Column(String)
    name = Column(String)
    name_en = Column(String)
    default_value = Column(String)
    value_type = Column(String)
    scope = Column(String)
    require = Column(Boolean)
    description = Column(String)
    description_en = Column(String)
    value_regex = Column(String)
    update_time = Column(DateTime)
    create_time = Column(DateTime)