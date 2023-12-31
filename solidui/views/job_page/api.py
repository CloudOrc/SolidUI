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
from datetime import datetime

from flask import request

from solidui.common.constants import JOB_PAGE_LAYOUT_TWO, JOB_PAGE_LAYOUT_ONE
from solidui.daos.exceptions import DAONotFound, DAOCreateFailedError
from solidui.daos.job_page import JobPageDAO
from solidui.entity.core import JobPage
from solidui.errors import SolidUIErrorType
from solidui.solidui_typing import FlaskResponse
from solidui.views.base import convert_to_dto
from solidui.views.base_api import BaseSolidUIApi
from flask_appbuilder.api import expose, safe

from solidui.views.base_schemas import JobPageDTOSchema
from solidui.views.job_page.schemas import JobPageVO, JobPageSchema

logger = logging.getLogger(__name__)


class JobPageRestApi(BaseSolidUIApi):
    route_base = "/solidui/job/page"

    @expose('', methods=('POST',))
    @safe
    def create_job_page(self) -> FlaskResponse:
        # Extract data from request
        job_page_data = request.json
        job_page_vo = JobPageVO(**job_page_data)

        job_page = JobPage(
            project_id=job_page_vo.projectId,
            name=job_page_vo.name,
            parent_id=job_page_vo.parentId,
            layout=job_page_vo.layout,
            orders=job_page_vo.orders
        )

        # Check if page name already exists
        existing_job_page = JobPageDAO.get_job_name(job_page.name, job_page.project_id)
        if existing_job_page:
            return self.handle_error(SolidUIErrorType.JOB_PAGE_ALREADY_EXISTS_ERROR)

        # Check parent page existence
        if job_page.parent_id and job_page.parent_id != 0:
            parent_job_page = JobPageDAO.find_by_id(job_page.parent_id)
            if not parent_job_page:
                return self.handle_error(SolidUIErrorType.QUERY_JOB_PAGE_ERROR)
            job_page.layout = JOB_PAGE_LAYOUT_TWO
        else:
            job_page.parent_id = 0
            job_page.layout = JOB_PAGE_LAYOUT_ONE

        job_page.create_time = datetime.now()
        job_page.update_time = datetime.now()

        # Insert job page
        try:
            JobPageDAO.create(item=job_page)
            job_page_schema = JobPageSchema()
            return self.response_format(data=job_page_schema.dump(job_page))
        except DAOCreateFailedError as ex:
            logger.exception(ex)
            return self.handle_error(SolidUIErrorType.CREATE_JOB_PAGE_ERROR)

    @expose('/<int:pk>', methods=('PUT',))
    @safe
    def update_job_page(self, pk) -> FlaskResponse:
        """
        update job page
        """
        job_page_data = request.json
        job_page_vo = JobPageVO(**job_page_data)

        job_page = JobPage(
            project_id=job_page_vo.projectId,
            name=job_page_vo.name,
            parent_id=job_page_vo.parentId,
            layout=job_page_vo.layout,
            orders=job_page_vo.orders
        )
        job_page.id = pk
        new_job_page = JobPageDAO.find_by_id(pk)
        if not new_job_page:
            return self.handle_error(SolidUIErrorType.QUERY_JOB_PAGE_ERROR)
        job_page.update_time = datetime.now()

        try:
            JobPageDAO.update(job_page)
        except DAOCreateFailedError as ex:
            logger.exception(ex)
            return self.handle_error(SolidUIErrorType.UPDATE_JOB_PAGE_ERROR)

        return self.response_format()

    @expose('/<int:pk>', methods=('DELETE',))
    @safe
    def delete_job_page(self, pk) -> FlaskResponse:
        """
        delete job page
        """
        job_page = JobPageDAO.find_by_id(pk)
        if not job_page:
            return self.handle_error(SolidUIErrorType.QUERY_JOB_PAGE_ERROR)

        child_pages = JobPageDAO.get_job_page_parent_ids(pk)
        if child_pages:
            for page in child_pages:
                JobPageDAO.delete_page_id(page.id)

        try:
            JobPageDAO.delete_page_id(pk)
            return self.response_format()  # Assuming success response
        except Exception as ex:
            logger.exception(ex)
            return self.handle_error(SolidUIErrorType.DELETE_JOB_PAGE_ERROR)

    @expose('/queryList/<int:project_id>', methods=('GET',))
    @safe
    def get_job_pages(self, project_id) -> FlaskResponse:
        """
        get job page
        """
        job_pages = JobPageDAO.get_job_page_project_ids(project_id)
        if not job_pages:
            # Handle empty case
            return self.handle_error(SolidUIErrorType.QUERY_JOB_PAGE_ERROR)

        # Convert JobPage to JobPageDTO and sort
        job_page_dtos = [convert_to_dto(job_page) for job_page in job_pages]
        sorted_job_page_dtos = sorted(job_page_dtos, key=lambda x: (x.parent_id or 0, x.orders or 0))

        # Group and nest job pages
        top_level_job_pages = [dto for dto in sorted_job_page_dtos if dto.layout == 1]
        second_level_job_pages = [dto for dto in sorted_job_page_dtos if dto.layout == 2]

        for top_level in top_level_job_pages:
            top_level.children = [dto for dto in second_level_job_pages if dto.parent_id == top_level.id]

        schema = JobPageDTOSchema()
        return self.response_format(data=schema.dump(top_level_job_pages, many=True))
