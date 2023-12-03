from sqlalchemy import Column, Integer, String, DateTime

from .base import Base

class JobElement(Base):

    __tablename__ = 'job_element'

    id = Column(Integer, primary_key=True)
    project_id = Column(Integer)
    name = Column(String)
    data = Column(String)
    data_type = Column(String)
    create_time = Column(DateTime)
    update_time = Column(DateTime)