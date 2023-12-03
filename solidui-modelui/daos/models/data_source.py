from sqlalchemy import Column, String, Integer, Boolean, DateTime
from sqlalchemy.orm import relationship

from .base import Base

class DataSource(Base):

    __tablename__ = 'data_source'

    id = Column(Integer, primary_key=True)
    name = Column(String)
    type_id = Column(Integer, ForeignKey('data_source_type.id'))
    description = Column(String)
    create_identify = Column(String)
    create_user = Column(String)
    create_time = Column(DateTime)
    labels = Column(String)
    expired = Column(Boolean)

    type = relationship('DataSourceType', back_populates='sources')

    def expire(self):
        self.expired = True

    def update(self, name, desc, type_id):
        self.name = name
        self.desc = desc
        self.type_id = type_id

    @staticmethod
    def create(name, type_id, desc, create_identify, create_user, labels):
        source = DataSource(name=name, type_id=type_id, desc=desc,
                            create_identify=create_identify,
                            create_user=create_user, labels=labels)
        return source