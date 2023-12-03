from sqlalchemy import Column, Integer, String, DateTime

from .base import Base

class User(Base):

    __tablename__ = 'user'

    id = Column(Integer, primary_key=True)
    name = Column(String)
    password = Column(String)
    create_time = Column(DateTime)
    update_time = Column(DateTime)
    queue = Column(String)