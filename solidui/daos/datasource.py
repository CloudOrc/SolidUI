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
from typing import Any
import logging

from solidui.utils.page_info import PageInfo

from solidui.daos.base import BaseDAO
from solidui.daos.exceptions import DAOCreateFailedError, DAOUpdateFailedError, DAONotFound, DAODeleteFailedError
from solidui.entity.core import DataSource

logger = logging.getLogger(__name__)


class DataSourceDAO(BaseDAO[DataSource]):
    model_cls = DataSource

    @classmethod
    def create_data_source(cls, data_source: DataSource) -> DataSource:
        new_data_source = super().find_one_or_none(datasource_name=data_source.datasource_name)
        if new_data_source is not None:
            raise DAOCreateFailedError(message="DataSource is already exists")

        return super().create(item=data_source)

    @classmethod
    def get_data_source_name(cls, data_source_name: int) -> DataSource:
        return super().find_one_or_none(datasource_name=data_source_name)

    @classmethod
    def get_data_source_id(cls, data_source_id: int) -> DataSource:
        return super().find_by_id(data_source_id)

    @classmethod
    def exist_data_source(cls, data_source_id: int) -> DataSource:
        data_source = super().find_by_id(data_source_id)
        if data_source is None:
            raise DAONotFound(message="DataSource is null")

        try:
            return super().update(item=data_source, attributes={'expire': True})
        except DAOUpdateFailedError as ex:
            logger.exception(ex.exception)
            raise ex

    @classmethod
    def get_data_source_page(cls, page_no: int, page_size: int, name_filter: str = None, type_filter: int = None,
                             expire_filter: bool = None) -> PageInfo:
        query = cls.model_cls.query

        # Apply filters
        if name_filter is not None:
            query = query.filter(cls.model_cls.datasource_name.like(f"%{name_filter}%"))
        if type_filter is not None:
            query = query.filter(cls.model_cls.datasource_type_id == type_filter)
        if expire_filter is not None:
            query = query.filter(cls.model_cls.expire == expire_filter)

        # Apply pagination
        pagination = query.paginate(page_no, page_size, error_out=False)

        page_info = PageInfo(page_no, page_size)
        page_info.set_total(pagination.total)
        page_info.set_total_list(pagination.items)

        return page_info

    @classmethod
    def delete_data_source(cls, data_source_id: int) -> None:
        if data_source_id is None:
            raise DAONotFound(message="DataSource id is required")

        data_source = cls.find_by_id(data_source_id)
        if not data_source:
            raise DAONotFound(message="DataSource is required")

        try:
            super().delete(data_source)
        except DAODeleteFailedError as ex:
            logger.exception(ex.exception)
            raise ex

    @classmethod
    def update_data_source(cls, data_source: DataSource) -> DataSource:
        if data_source.id is None:
            raise DAONotFound(message="DataSource id is required")

        existing_data_source = cls.find_by_id(data_source.id)
        if not existing_data_source:
            raise DAONotFound(message="DataSource is required")

        try:
            return super().update(existing_data_source, data_source.__dict__)
        except DAOUpdateFailedError as ex:
            logger.exception(ex)
            raise ex

