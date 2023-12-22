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

from datetime import datetime
from typing import Optional
from solidui.daos.base import BaseDAO
from solidui.daos.exceptions import DAONotFound
from solidui.entity.core import Project
from solidui.utils.page_info import PageInfo
from sqlalchemy import or_


class ProjectDAO(BaseDAO[Project]):
    model_cls = Project

    @classmethod
    def create_project(cls, project_name: str, description: str, user_name: str) -> Project:
        attributes = {
            'project_name': project_name,
            'user_name': user_name,
            'description': description,
            'create_time': datetime.now(),
            'update_time': datetime.now(),
            'status': 0
        }

        return super().create(attributes=attributes)

    @classmethod
    def update_project(cls, project_id: int, name: Optional[str] = None, image: Optional[str] = None,
                       desc: Optional[str] = None) -> Project:
        project = super().find_by_id(project_id)
        if not project:
            raise DAONotFound(message="Project not found")

        attributes = {}
        if name:
            attributes['project_name'] = name
        if image:
            attributes['image'] = image
        if desc:
            attributes['description'] = desc

        attributes['update_time'] = datetime.now()
        attributes['status'] = 0

        return super().update(item=project, attributes=attributes)

    @classmethod
    def delete_project(cls, project_id: int) -> Project:
        project = super().find_by_id(project_id)
        if not project:
            raise DAONotFound(message="Project not found")

        project.status = 1  # Assuming '1' means deleted

        return super().update(item=project, attributes={'status': project.status})

    @classmethod
    def get_project(cls, project_id: int) -> Project:
        project = super().find_by_id(project_id)
        if not project:
            raise DAONotFound(message="Project not found")
        return project

    @classmethod
    def query_project_list_paging(cls, search_name: str, page_no: int, page_size: int) -> PageInfo[Project]:
        # Build custom filters
        custom_filters = None
        if search_name:
            custom_filters = or_(
                cls.model_cls.project_name.like(f'%{search_name}%'),
                cls.model_cls.description.like(f'%{search_name}%')
            )

        # Using the query_paginated method of BaseDAO
        pagination = super().query_paginated(
            page=page_no,
            per_page=page_size,
            custom_filters=custom_filters,
            status=0,
            sort_by='create_time',
            sort_order='desc'
        )

        # Create PageInfo object
        page_info = PageInfo(page_no, page_size)
        page_info.set_total(pagination.total)
        page_info.set_total_list(pagination.items)

        return page_info
