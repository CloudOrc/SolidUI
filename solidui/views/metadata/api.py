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
import logging
from flask import request

from solidui.daos.datasource import DataSourceDAO
from solidui.daos.datasource_type import DataSourceTypeDAO
from solidui.daos.exceptions import DAONotFound
from solidui.datasource_plugin.base import JdbcClientFactory
from solidui.errors import SolidUIErrorType
from solidui.solidui_typing import FlaskResponse
from solidui.views.base_api import BaseSolidUIApi
from flask_appbuilder.api import expose, safe

logger = logging.getLogger(__name__)


class MetadataQueryRestApi(BaseSolidUIApi):
    route_base = "/solidui/metadataQuery"

    @expose('/queryDatabases', methods=("GET",))
    @safe
    def get_databases(self) -> FlaskResponse:
        data_source_name = request.args.get('dataSourceName')
        # Call the service method to get databases. You need to implement this logic

        data_source = DataSourceDAO.get_data_source_name(data_source_name)
        if data_source is None:
            return self.handle_error(SolidUIErrorType.QUERY_DATASOURCE_ERROR)

        data_source_type = DataSourceTypeDAO.get_id(data_source.datasource_type_id)
        if data_source_type is None:
            return self.handle_error(SolidUIErrorType.QUERY_DATASOURCE_TYPE_ERROR)

        # Parse the JSON parameters
        params = json.loads(data_source.parameter)

        # Create a JDBC client
        jdbc_client = JdbcClientFactory.create_client(
            db_type=data_source_type.name.lower(),  # Assuming MySQL for example
            host=params.get("host"),
            port=params.get("port"),
            username=params.get("username"),
            password=params.get("password"),
            database=params.get("database"),
            extra_params=params.get("params", {})
        )

        try:
            # Retrieve and return the list of databases
            databases = JdbcClientFactory.get_databases(jdbc_client)
            return self.response_format(data=databases)

        except DAONotFound as ex:
            logger.exception(ex)
            return self.handle_error(SolidUIErrorType.QUERY_METADATA_DB_ERROR)

    @expose('/queryTables', methods=("GET",))
    @safe
    def get_tables(self) -> FlaskResponse:
        data_source_name = request.args.get('dataSourceName')
        database = request.args.get('database')
        # Call the service method to get tables. You need to implement this logic

        data_source = DataSourceDAO.get_data_source_name(data_source_name)
        if data_source is None:
            return self.handle_error(SolidUIErrorType.QUERY_DATASOURCE_ERROR)

        data_source_type = DataSourceTypeDAO.get_id(data_source.datasource_type_id)
        if data_source_type is None:
            return self.handle_error(SolidUIErrorType.QUERY_DATASOURCE_TYPE_ERROR)

        # Parse the JSON parameters
        params = json.loads(data_source.parameter)

        # Create a JDBC client
        jdbc_client = JdbcClientFactory.create_client(
            db_type=data_source_type.name,  # Assuming MySQL for example
            host=params.get("host"),
            port=params.get("port"),
            username=params.get("username"),
            password=params.get("password"),
            database=params.get("database"),
            extra_params=params.get("params", {})
        )

        try:
            # Retrieve and return the list of databases
            tables = JdbcClientFactory.get_tables(jdbc_client, database)
            return self.response_format(data=tables)

        except DAONotFound as ex:
            logger.exception(ex)
            return self.handle_error(SolidUIErrorType.QUERY_METADATA_TABLE_ERROR)

    @expose('/queryTableData', methods=("GET",))
    @safe
    def get_table_data(self) -> FlaskResponse:
        data_source_name = request.args.get('dataSourceName')
        database = request.args.get('database')
        table_name = request.args.get('tableName')
        type_name = request.args.get('typeName', default=None)
        # Call the service method to get table data. You need to implement this logic
        data_source = DataSourceDAO.get_data_source_name(data_source_name)
        if data_source is None:
            return self.handle_error(SolidUIErrorType.QUERY_DATASOURCE_ERROR)

        data_source_type = DataSourceTypeDAO.get_id(data_source.datasource_type_id)
        if data_source_type is None:
            return self.handle_error(SolidUIErrorType.QUERY_DATASOURCE_TYPE_ERROR)

        # Parse the JSON parameters
        params = json.loads(data_source.parameter)

        # Create a JDBC client
        jdbc_client = JdbcClientFactory.create_client(
            db_type=data_source_type.name,  # Assuming MySQL for example
            host=params.get("host"),
            port=params.get("port"),
            username=params.get("username"),
            password=params.get("password"),
            database=params.get("database"),
            extra_params=params.get("params", {})
        )

        select_all_data_sql = jdbc_client.generate_select_all_data_sql(database, table_name)
        select_result = JdbcClientFactory.run_query(jdbc_client, select_all_data_sql)

        # Transform the result into the desired format
        if not select_result or len(select_result) == 1:
            return self.handle_error(SolidUIErrorType.QUERY_METADATA_SQL_ERROR)

        field_value_results = []
        columns = select_result[0]
        for row in select_result[1:]:
            field_value_results.append(dict(zip(columns, row)))

        return self.response_format(data=field_value_results)

    @expose('/querySql', methods=("GET",))
    @safe
    def query_sql(self) -> FlaskResponse:
        data_source_name = request.args.get('dataSourceName')
        sql = request.args.get('sql')

        # Call the service method to get table data. You need to implement this logic
        data_source = DataSourceDAO.get_data_source_name(data_source_name)
        if data_source is None:
            return self.handle_error(SolidUIErrorType.QUERY_DATASOURCE_ERROR)

        data_source_type = DataSourceTypeDAO.get_id(data_source.datasource_type_id)
        if data_source_type is None:
            return self.handle_error(SolidUIErrorType.QUERY_DATASOURCE_TYPE_ERROR)

        # Parse the JSON parameters
        params = json.loads(data_source.parameter)

        # Create a JDBC client
        jdbc_client = JdbcClientFactory.create_client(
            db_type=data_source_type.name,  # Assuming MySQL for example
            host=params.get("host"),
            port=params.get("port"),
            username=params.get("username"),
            password=params.get("password"),
            database=params.get("database"),
            extra_params=params.get("params", {})
        )

        try:

            data_list = JdbcClientFactory.run_query(jdbc_client, sql)
            return self.response_format(data=data_list)

        except DAONotFound as ex:
            logger.exception(ex)
            return self.handle_error(SolidUIErrorType.QUERY_METADATA_SQL_ERROR)

    @expose('/querySql/id', methods=("GET",))
    @safe
    def query_sql_by_id(self) -> FlaskResponse:
        data_source_id = request.args.get('dataSourceId', type=int)
        sql = request.args.get('sql')
        # Call the service method to execute the SQL query by ID. You need to implement this logic

        # Call the service method to get table data. You need to implement this logic
        data_source = DataSourceDAO.get_data_source_id(data_source_id)
        if data_source is None:
            return self.handle_error(SolidUIErrorType.QUERY_DATASOURCE_ERROR)

        data_source_type = DataSourceTypeDAO.get_id(data_source.datasource_type_id)
        if data_source_type is None:
            return self.handle_error(SolidUIErrorType.QUERY_DATASOURCE_TYPE_ERROR)

        # Parse the JSON parameters
        params = json.loads(data_source.parameter)

        # Create a JDBC client
        jdbc_client = JdbcClientFactory.create_client(
            db_type=data_source_type.name,  # Assuming MySQL for example
            host=params.get("host"),
            port=params.get("port"),
            username=params.get("username"),
            password=params.get("password"),
            database=params.get("database"),
            extra_params=params.get("params", {})
        )

        try:

            data_list = JdbcClientFactory.run_query(jdbc_client, sql)
            return self.response_format(data=data_list)

        except DAONotFound as ex:
            logger.exception(ex)
            return self.handle_error(SolidUIErrorType.QUERY_METADATA_SQL_ERROR)
