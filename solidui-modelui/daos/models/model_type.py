from sqlalchemy import Column, Integer, String

from .base import Base

class ModelType(Base):

    __tablename__ = 'model_type'

    id = Column(Integer, primary_key=True)
    name = Column(String)
    code = Column(String)
    type_name = Column(String)
    prompt = Column(String)
    token = Column(String)
    baseurl = Column(String)