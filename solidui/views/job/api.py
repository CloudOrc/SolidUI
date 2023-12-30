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

from solidui.daos.exceptions import DAOCreateFailedError
from solidui.daos.job_element import JobElementDAO
from solidui.daos.job_element_page import JobElementPageDAO
from solidui.entity.core import JobElementPage, JobElement
from solidui.errors import SolidUIErrorType
from solidui.solidui_typing import FlaskResponse
from solidui.views.base import deep_copy_view_to_data_view, save_job_element_page, create_job_element_page_vo
from solidui.views.base_api import BaseSolidUIApi
from flask_appbuilder.api import expose, safe

from solidui.views.base_schemas import JobElementPageVO, Page, Size, View

logger = logging.getLogger(__name__)


class JobRestApi(BaseSolidUIApi):
    route_base = "/solidui/job"

    @expose('/save/page', methods=("POST",))
    @safe
    def save_page(self) -> FlaskResponse:
        # Logic to create job element page
        # Return appropriate response
        job_element_page_vo = JobElementPageVO(**request.json)

        if not job_element_page_vo.projectId:
            return self.handle_error(SolidUIErrorType.QUERY_JOB_PAGE_ERROR)

            # Validate page and size information
        if not job_element_page_vo.page or not job_element_page_vo.size:
            return self.handle_error(SolidUIErrorType.QUERY_JOB_PAGE_ERROR)

        views = job_element_page_vo.views
        if not views:
            # If the list is empty, save the job element page with jobElementId set to 0
            try:
                save_job_element_page(job_element_page_vo.page.id, 0, job_element_page_vo.size)
                return self.response_format()
            except DAOCreateFailedError as ex:
                logger.exception(ex)
                return self.handle_error(SolidUIErrorType.CREATE_JOB_PAGE_ERROR)

        for view in views:
            job_element = JobElement(
                project_id=job_element_page_vo.projectId,
                data_type=view.type,
                name=view.title,
                create_time=datetime.now(),
                update_time=datetime.now()
            )
            job_element.data = deep_copy_view_to_data_view(view)
            try:
                JobElementDAO.create(item=job_element)
                save_job_element_page(job_element_page_vo.page.id, job_element.id, job_element_page_vo.size)
            except DAOCreateFailedError as ex:
                logger.exception(ex)
                return self.handle_error(SolidUIErrorType.CREATE_JOB_ERROR)

        return self.response_format()

    @expose('/update/page', methods=('PUT',))
    @safe
    def update_job_page(self) -> FlaskResponse:
        job_element_page_vo = JobElementPageVO(**request.json)

        if not job_element_page_vo.projectId:
            return self.handle_error(SolidUIErrorType.QUERY_JOB_PAGE_ERROR)

            # Validate page and size information
        if not job_element_page_vo.page or not job_element_page_vo.size:
            return self.handle_error(SolidUIErrorType.QUERY_JOB_PAGE_ERROR)

        job_element_pages: list[JobElementPage] = JobElementPageDAO.get_job_element_page_id(job_element_page_vo.page.id)
        if job_element_pages:
            for ep in job_element_pages:
                JobElementPageDAO.delete(ep)

                if ep.job_element_id and ep.job_element_id > 0:
                    job_element = JobElementDAO.find_by_id(ep.job_element_id)
                    if job_element:
                        JobElementDAO.delete(ep.job_element)

        views = job_element_page_vo.views
        if not views:
            # If the list is empty, save the job element page with jobElementId set to 0
            try:
                save_job_element_page(job_element_page_vo.page.id, 0, job_element_page_vo.size)
                return self.response_format()
            except DAOCreateFailedError as ex:
                logger.exception(ex)
                return self.handle_error(SolidUIErrorType.UPDATE_JOB_ERROR)

        for view in views:
            job_element = JobElement(
                project_id=job_element_page_vo.projectId,
                data_type=view.type,
                name=view.title,
                create_time=datetime.now(),
                update_time=datetime.now()
            )
            job_element.data = deep_copy_view_to_data_view(view)
            try:
                JobElementDAO.create(item=job_element)
                save_job_element_page(job_element_page_vo.page.id, job_element.id, job_element_page_vo.size)
            except DAOCreateFailedError as ex:
                logger.exception(ex)
                return self.handle_error(SolidUIErrorType.UPDATE_JOB_ERROR)

        return self.response_format()

    @expose('/query/page', methods=('GET',))
    @safe
    def query_job_page(self) -> FlaskResponse:
        project_id = int(request.args.get('projectId'))
        page_id: int = int(request.args.get('pageId'))
        job_element_page_vos = JobElementPageVO()
        job_element_page_vos.projectId = project_id

        if project_id is None or page_id is None:
            return self.handle_error(SolidUIErrorType.QUERY_JOB_ERROR)

        job_element_pages = JobElementPageDAO.get_job_element_page_id(page_id)
        if not job_element_pages:
            return self.handle_error(SolidUIErrorType.QUERY_JOB_ERROR)

        first = True
        views: list[View] = []
        job_element = None

        for job_element_page in job_element_pages:
            # Retrieve the associated JobElement
            job_element_id = job_element_page.jobElementId
            if job_element_id and job_element_id > 0:
                # Assuming job_element_mapper is an instance with a select_by_id method
                job_element = JobElementDAO.find_by_id(job_element_id)

            if first:
                job_element_page_vos.page = Page(id=job_element_page.jobPageId)
                # Assuming JSONUtils is replaced with a Python JSON library
                job_element_page_vos.size = json.loads(job_element_page.position)
                first = False

            # Create JobElementPageVO from JobElement and JobElementPage
            create_job_element_page_vo(job_element, views)

        job_element_page_vos.views = views
        return self.response_format(data=job_element_page_vos)
