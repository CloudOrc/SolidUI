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
import json

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class DataSourceType(Base):
    __tablename__ = 'solidui_datasource_type'

    id = Column(Integer, primary_key=True)
    name = Column(String(32), nullable=False, default='')
    description = Column(String(255), nullable=False, default='')
    option = Column(String(32), nullable=False, default='')
    classifier = Column(String(32), nullable=False, default='')
    icon = Column(String(255), nullable=False, default='')
    layers = Column(Integer, nullable=False)

class DataSource(Base):
    __tablename__ = 'solidui_datasource'

    id = Column(Integer, primary_key=True)
    datasource_name = Column(String(255), nullable=False)
    datasource_desc = Column(String(255))
    datasource_type_id = Column(Integer, ForeignKey('solidui_datasource_type.id'), nullable=False)
    create_identify = Column(String(255))
    parameter = Column(String(255))
    create_time = Column(DateTime)
    create_user = Column(String(255))
    labels = Column(String(255))
    expire = Column(Boolean, default=False)

    datasource_type = relationship("DataSourceType")

class DataSourceTypeKey(Base):
    __tablename__ = 'solidui_datasource_type_key'

    id = Column(Integer, primary_key=True)
    data_source_type_id = Column(Integer, ForeignKey('solidui_datasource_type.id'), nullable=False)
    key = Column(String(32), nullable=False)
    name = Column(String(32), nullable=False)
    name_en = Column(String(32), nullable=False)
    default_value = Column(String(50))
    value_type = Column(String(50), nullable=False)
    scope = Column(String(50))
    require = Column(Boolean, default=False)
    description = Column(String(200))
    description_en = Column(String(200))
    value_regex = Column(String(200))
    update_time = Column(DateTime, nullable=False)
    create_time = Column(DateTime, nullable=False)

    datasource_type = relationship("DataSourceType")

class JobElement(Base):
    __tablename__ = 'solidui_job_element'

    id = Column(Integer, primary_key=True)
    project_id = Column(Integer, ForeignKey('solidui_project.id'), nullable=False)
    name = Column(String(255), nullable=False, default='')
    data = Column(Text, nullable=False)
    data_type = Column(String(255), nullable=False, default='')
    create_time = Column(DateTime, nullable=False)
    update_time = Column(DateTime, nullable=False)

    project = relationship("Project")
class JobElementPage(Base):
    __tablename__ = 'solidui_job_element_page'

    id = Column(Integer, primary_key=True)
    job_page_id = Column(Integer, ForeignKey('solidui_job_page.id'), nullable=False)
    job_element_id = Column(Integer, ForeignKey('solidui_job_element.id'), nullable=False)
    position = Column(String(255), nullable=False, default='')
    create_time = Column(DateTime, nullable=False)
    update_time = Column(DateTime, nullable=False)

    job_page = relationship("JobPage")
    job_element = relationship("JobElement")
class JobPage(Base):
    __tablename__ = 'solidui_job_page'

    id = Column(Integer, primary_key=True)
    project_id = Column(Integer, ForeignKey('solidui_project.id'), nullable=False)
    name = Column(String(255), nullable=False, default='')
    parent_id = Column(Integer)
    layout = Column(Integer, nullable=False)
    orders = Column(Integer, nullable=False)
    create_time = Column(DateTime, nullable=False)
    update_time = Column(DateTime, nullable=False)

    project = relationship("Project")
class Project(Base):
    __tablename__ = 'solidui_project'

    id = Column(Integer, primary_key=True)
    user_name = Column(String(100), nullable=False, default='')
    project_name = Column(String(255), nullable=False, default='')
    image = Column(String(255))
    description = Column(String(255))
    create_time = Column(DateTime)
    update_time = Column(DateTime)
    status = Column(Integer, nullable=False, default=0)

class User(Base):
    __tablename__ = 'solidui_user'

    id = Column(Integer, primary_key=True)
    user_name = Column(String(20), nullable=False, default='')
    user_password = Column(String(255), nullable=False, default='')
    create_time = Column(DateTime, nullable=False)
    update_time = Column(DateTime, nullable=False)
    queue = Column(String(20))

    @property
    def json_data(self) -> str:
        return json.dumps(self.data)

class ModelType(Base):
    __tablename__ = 'solidui_model_type'

    id = Column(Integer, primary_key=True)
    name = Column(String(255))
    code = Column(String(255))
    type_name = Column(String(255))
    prompt = Column(Text)
    token = Column(String(255))
    baseurl = Column(String(255))
