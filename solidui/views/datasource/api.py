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

import logging
from flask import request

from solidui.daos.datasource import DataSourceDAO
from solidui.daos.datasource_type import DataSourceTypeDAO
from solidui.daos.exceptions import DAONotFound, DAOUpdateFailedError, DAOException, DAODeleteFailedError
from solidui.entity.core import DataSource
from solidui.errors import SolidUIErrorType
from solidui.solidui_typing import FlaskResponse
from solidui.views.base_api import BaseSolidUIApi
from flask_appbuilder.api import expose, safe
from solidui.views.datasource.schemas import DataSourceTypeSchema, DataSourceSchema, DataSourcePageInfoSchema

logger = logging.getLogger(__name__)


class DataSourceRestApi(BaseSolidUIApi):
    route_base = "/solidui/datasource"

    @expose('/type/all', methods=("GET",))
    @safe
    def get_all_data_source_types(self) -> FlaskResponse:
        """
        get all data source types
        """
        data_list = DataSourceTypeDAO.find_all()
        schema = DataSourceTypeSchema(many=True)
        return self.response_format(data=schema.dump(data_list))

    @expose('/key/type/<int:type_id>', methods=("GET",))
    @safe
    def get_key_by_type(self, type_id) -> FlaskResponse:
        """
        get key definitions by type
        """
        data = DataSourceTypeDAO.get_id(type_id)
        schema = DataSourceTypeSchema()
        return self.response_format(data=schema.dump(data))

    @expose('/info/json', methods=("POST",))
    @safe
    def insert_json_info(self) -> FlaskResponse:
        """
        insert json info
        """
        data = request.get_json()
        data_source = DataSource(**data)

        # Verify data source name and type ID
        if not data_source.datasource_name or not data_source.datasource_type_id:
            return self.handle_error(SolidUIErrorType.QUERY_DATASOURCE_ERROR)

        try:
            DataSourceDAO.create_data_source(data_source)
            return self.response_format()

        except DAONotFound as ex:
            logger.exception(ex)
            return self.handle_error(SolidUIErrorType.CREATE_DATASOURCE_ERROR)

    @expose('/info/<int:data_source_id>/json', methods=("PUT",))
    @safe
    def update_json_info(self, data_source_id) -> FlaskResponse:
        """
        update data source in json
        """
        data = request.get_json()

        if not data:
            return self.handle_error(SolidUIErrorType.QUERY_DATASOURCE_ERROR)

        try:

            data_source = DataSource(**data)
            data_source.id = data_source_id  # Make sure the ID passed in is set to the data source object
            DataSourceDAO.update_data_source(data_source)
            return self.response_format()
        except DAONotFound as ex:
            logger.exception(ex)
            return self.handle_error(SolidUIErrorType.QUERY_DATASOURCE_ERROR)
        except DAOUpdateFailedError as ex:
            logger.exception(ex)
            return self.handle_error(SolidUIErrorType.UPDATE_DATASOURCE_ERROR)

    @expose('/info/<int:data_source_id>', methods=("GET",))
    @safe
    def get_info_by_data_source_id(self, data_source_id) -> FlaskResponse:
        """
        get info by data source id
        """
        try:
            data_source = DataSourceDAO.get_data_source_id(data_source_id)
            if data_source is None:
                return self.handle_error(SolidUIErrorType.QUERY_DATASOURCE_ERROR)

            schema = DataSourceSchema()
            return self.response_format(data=schema.dump(data_source))
        except DAOException as ex:
            logger.exception(ex)
            return self.handle_error(SolidUIErrorType.INTERNAL_SERVER_ERROR)

    @expose('/info/name/<string:data_source_name>', methods=("GET",))
    @safe
    def get_info_by_data_source_name(self, data_source_name) -> FlaskResponse:
        """
        get info by data source name
        """
        try:
            data_source = DataSourceDAO.get_data_source_name(data_source_name)
            if data_source is not None:
                schema = DataSourceSchema()
                return self.response_format(data=schema.dump(data_source))
            else:
                return self.handle_error(SolidUIErrorType.QUERY_DATASOURCE_ERROR)
        except DAOException as ex:
            logger.exception(ex)
            return self.handle_error(SolidUIErrorType.INTERNAL_SERVER_ERROR)

    @expose('/info/delete/<int:data_source_id>', methods=("DELETE",))
    @safe
    def remove_data_source(self, data_source_id) -> FlaskResponse:
        """
        get info by data source name
        """
        try:

            DataSourceDAO.delete_data_source(data_source_id)
            return self.response_format()

        except DAODeleteFailedError as ex:
            logger.exception(ex)
            return self.handle_error(SolidUIErrorType.DELETE_DATASOURCE_ERROR)

    @expose('/info/<int:data_source_id>/expire', methods=("PUT",))
    @safe
    def expire_data_source(self, data_source_id) -> FlaskResponse:
        """
        expire data source
        """
        try:

            DataSourceDAO.exist_data_source(data_source_id)
            return self.response_format()

        except DAOUpdateFailedError as ex:
            logger.exception(ex)
            return self.handle_error(SolidUIErrorType.UPDATE_DATASOURCE_ERROR)

    @expose('/info', methods=("GET",))
    @safe
    def query_data_source(self) -> FlaskResponse:
        """
        query data source
        """
        try:
            data_source_name = request.args.get('name', default=None, type=str)
            data_source_type_id = request.args.get('typeId', default=None, type=int)
            expire = request.args.get('expire', default=None, type=bool)
            page_size = request.args.get('pageSize', default=10, type=int)
            page_no = request.args.get('pageNo', default=1, type=int)

            # Ensure page size and page number are positive integers
            page_size = max(1, page_size)
            page_no = max(1, page_no)

            # Query and paginate data sources
            page_info = DataSourceDAO.get_data_source_page(
                page_no=page_no,
                page_size=page_size,
                name_filter=data_source_name,
                type_filter=data_source_type_id,
                expire_filter=expire
            )

            # Format the response
            page_info_schema = DataSourcePageInfoSchema()
            return self.response_format(data=page_info_schema.dump(page_info))

        except DAONotFound as ex:
            logger.exception(ex)
            return self.handle_error(SolidUIErrorType.QUERY_DATASOURCE_ERROR)

    @expose('/connect/json', methods=("POST",))
    @safe
    def connect(self) -> FlaskResponse:
        """
        connect
        """
        data_source_name = request.form.get('dataSourceName')
        type_name = request.form.get('typeName', default=None)

        return self.response_format()
