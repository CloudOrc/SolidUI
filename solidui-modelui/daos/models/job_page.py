from sqlalchemy import Column, Integer, String, DateTime

from .base import Base

class JobPage(Base):

    __tablename__ = 'job_page'

    id = Column(Integer, primary_key=True)
    project_id = Column(Integer)
    name = Column(String)
    orders = Column(Integer)
    parent_id = Column(Integer)
    layout = Column(String)
    create_time = Column(DateTime)
    update_time = Column(DateTime)