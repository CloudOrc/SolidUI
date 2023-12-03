from sqlalchemy import Column, Integer, String, DateTime

from .base import Base

class Project(Base):

    __tablename__ = 'project'

    id = Column(Integer, primary_key=True)
    user_name = Column(String)
    name = Column(String)
    image = Column(String)
    description = Column(String)
    create_time = Column(DateTime)
    update_time = Column(DateTime)