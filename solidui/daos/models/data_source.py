#
# Licensed to the Apache Software Foundation (ASF) under one or more
# contributor license agreements.  See the NOTICE file distributed with
# this work for additional information regarding copyright ownership.
# The ASF licenses this file to You under the Apache License, Version 2.0
# (the "License"); you may not use this file except in compliance with
# the License.  You may obtain a copy of the License at
# http://www.apache.org/licenses/LICENSE-2.0
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
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