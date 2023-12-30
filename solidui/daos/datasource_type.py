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

from solidui.daos.base import BaseDAO
from solidui.daos.exceptions import DAONotFound
from solidui.entity.core import DataSourceType


class DataSourceTypeDAO(BaseDAO[DataSourceType]):
    model_cls = DataSourceType

    @classmethod
    def all_list(cls) -> list[DataSourceType]:
        return super().find_all()

    @classmethod
    def get_id(cls, id: int) -> DataSourceType:
        data_source_type = super().find_by_id(id)
        if not data_source_type:
            raise DAONotFound(message="DataSourceType not found")
        return data_source_type
