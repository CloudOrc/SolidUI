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

from __future__ import annotations

from solidui.extensions import db

from solidui.utils.page_info import PageInfo

from solidui.daos.base import BaseDAO
from solidui.entity.core import ModelType


class ModelTypeDAO(BaseDAO[ModelType]):
    model_cls = ModelType

    @classmethod
    def get_list(cls) -> list[ModelType]:
        return super().find_all()

    @classmethod
    def get_model_types(cls, page=1, per_page=10) -> PageInfo:
        pagination = super().find_paginated(page=page, per_page=per_page)
        page_info = PageInfo[ModelType](page, per_page)
        page_info.set_total(pagination.total)
        page_info.set_total_list(pagination.items)
        return page_info

    @classmethod
    def delete_model_type(cls, pk: int) -> None:
        db.session.query(ModelType).filter_by(id=pk).delete()
        db.session.commit()
