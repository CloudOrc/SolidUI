from sqlalchemy import Column, Integer, String, DateTime

from .base import Base

class JobElementPage(Base):

    __tablename__ = 'job_element_page'

    id = Column(Integer, primary_key=True)
    page_id = Column(Integer)
    element_id = Column(Integer)
    position = Column(String)
    create_time = Column(DateTime)
    update_time = Column(DateTime)
