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
from enums import Status
from exceptions import DataSourceNotFound


class MetadataController:

    def __init__(self, metadata_service):
        self.metadata_service = metadata_service

    def get_databases(self, source_name):
        return self.metadata_service.get_databases(source_name)

    def get_tables(self, source_name, db_name):
        return self.metadata_service.get_tables(source_name, db_name)

    def get_table_data(self, source_name, db_name, table_name):
        return self.metadata_service.get_table_data(source_name, db_name, table_name)

    def query_sql(self, source_name, sql):
        return self.metadata_service.query_sql(source_name, sql)

    def query_sql_by_id(self, source_id, sql):
        return self.metadata_service.query_sql(source_id, sql)


class MetadataService:

    def __init__(self, source_dao, type_dao, db_client):
        self.source_dao = source_dao
        self.type_dao = type_dao
        self.db_client = db_client

    def get_databases(self, source_name):
        source = self.source_dao.get_by_name(source_name)
        if not source:
            raise DataSourceNotFound()

        source_type = self.type_dao.get(source.type_id)
        if not source_type:
            raise InvalidDataSourceType()

        db_client = self.db_client.create(source, source_type)
        return db_client.get_databases()

    def get_tables(self, source_name, db_name):
        # 校验数据源
        source_type = self._validate_source(source_name)

        db_client = self.db_client.create(source, source_type)
        return db_client.get_tables(db_name)

    def get_table_data(self, source_name, db_name, table_name):
        # 校验数据源
        source_type = self._validate_source(source_name)

        db_client = self.db_client.create(source, source_type)
        return db_client.get_table_data(db_name, table_name)

    def query_sql(self, source_id, sql):
        source = self.source_dao.get(source_id)
        if not source:
            raise DataSourceNotFound()

        source_type = self.type_dao.get(source.type_id)
        if not source_type:
            raise InvalidDataSourceType()

        db_client = self.db_client.create(source, source_type)
        return db_client.execute_sql(sql)

    def _validate_source(self, source_name):
        source = self.source_dao.get_by_name(source_name)
        if not source:
            raise DataSourceNotFound()

        source_type = self.type_dao.get(source.type_id)
        if not source_type:
            raise InvalidDataSourceType()

        return source_type

class InvalidDataSourceType(Exception):
    """Raised when an invalid data source type is encountered"""

    def __init__(self, message="Invalid data source type"):
        self.message = message
        super().__init__(self.message)