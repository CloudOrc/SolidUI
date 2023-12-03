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

from flask import request

from exceptions import DataSourceNotFound, DataSourceTypeNotFound
from utils import paginate


class DataSourceController:

    def __init__(self, data_source_service, type_service, metadata_service):
        self.data_source_service = data_source_service
        self.type_service = type_service
        self.metadata_service = metadata_service

    def get_types(self):
        return self.type_service.get_all()

    def get_keys(self, type_id):
        return self.type_service.get_keys(type_id)

    def create(self):
        data = request.get_json()
        name = data['name']
        type_id = data['type_id']
        params = data['params']

        if not name:
            raise InvalidParameterError('Name is required')

        if not type_id:
            raise InvalidParameterError('Type is required')

        if not params:
            raise InvalidParameterError('Params are required')

        return self.data_source_service.create(name, type_id, params)

    def get(self, source_id):
        source = self.data_source_service.get(source_id)
        if not source:
            raise DataSourceNotFound()
        return source

    def update(self, source_id):
        data = request.get_json()
        data['id'] = source_id
        return self.data_source_service.update(data)

    def delete(self, source_id):
        return self.data_source_service.delete(source_id)

    def query(self):
        name = request.args.get('name')
        type_id = request.args.get('type_id')
        expired = request.args.get('expired')
        page, page_size = paginate(request)

        return self.data_source_service.query(name, type_id, expired, page, page_size)

    def get_metadata(self, source_id):
        return self.metadata_service.get_metadata(source_id)


class DataSourceService:

    def __init__(self, source_dao, type_dao):
        self.source_dao = source_dao
        self.type_dao = type_dao

    def get(self, source_id):
        source = self.source_dao.get(source_id)
        if not source:
            raise DataSourceNotFound

        return source

    def create(self, name, type_id, params):
        # 1. 检查名称是否已存在
        if self.source_dao.get_by_name(name):
            raise DuplicateDataSourceNameError

        # 2. 检查类型是否存在
        if not self.type_dao.get(type_id):
            raise InvalidDataSourceTypeError

        # 3. 验证参数格式
        self._validate_params(type_id, params)

        # 4. 插入数据源
        source = {
            'name': name,
            'type_id': type_id,
            'params': params
        }
        source_id = self.source_dao.insert(source)

        return source_id

    def update(self, data):
        source = self.get(data['id'])

        # 1. 检查名称是否与现有源冲突
        if data.get('name') and data['name'] != source['name']:
            if self.source_dao.get_by_name(data['name']):
                raise DuplicateDataSourceNameError

        # 2. 检查类型是否存在
        if data.get('type_id') and data['type_id'] != source['type_id']:
            if not self.type_dao.get(data['type_id']):
                raise InvalidDataSourceTypeError

        # 3. 验证参数格式
        if data.get('params'):
            self._validate_params(source['type_id'], data['params'])

        self.source_dao.update(data['id'], data)

        return Success()

    def _validate_params(self, type_id, params):
        # 实现参数校验逻辑
        pass

    def delete(self, source_id):
        return self.source_dao.delete(source_id)

    def query(self, name, type_id, expired, page, page_size):
        return self.source_dao.query(name, type_id, expired, page, page_size)

class MetadataService:

    def get_metadata(self, source_id):
        source = get_source(source_id)
        if not source:
            raise DataSourceNotFound()

        type = get_type(source.type_id)
        if not type:
            raise DataSourceTypeNotFound()

        # 使用type和source查询metadata
        return metadata