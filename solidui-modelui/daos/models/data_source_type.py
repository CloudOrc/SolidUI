from sqlalchemy import Column, String, Integer
from sqlalchemy.orm import relationship

from .base import Base


class DataSourceType(Base):
    __tablename__ = 'data_source_type'

    id = Column(Integer, primary_key=True)
    name = Column(String)
    description = Column(String)
    option = Column(String)
    classifier = Column(String)
    icon = Column(String)
    layers = Column(String)

    sources = relationship('DataSource', back_populates='type')