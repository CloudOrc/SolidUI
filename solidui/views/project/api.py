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

from solidui.daos.project import ProjectDAO
from solidui.errors import SolidUIErrorType
from solidui.solidui_typing import FlaskResponse
from solidui.views.base_api import BaseSolidUIApi
from flask_appbuilder.api import expose, safe
from solidui.utils.login_utils import get_login_user
from solidui.views.project.schemas import ProjectSchema, PageInfoSchema


class ProjectRestApi(BaseSolidUIApi):
    route_base = "/solidui/projects"

    @expose('', methods=("POST",))
    @safe
    def create(self) -> FlaskResponse:
        """
        create project
        """
        project_name = request.form.get('projectName')
        description = request.form.get('description', default='')

        if not project_name:
            return self.handle_error(SolidUIErrorType.PROJECT_NOT_EXISTS_ERROR)

        cookie = request.cookies
        if cookie is None:
            return self.handle_error(SolidUIErrorType.COOKIE_IS_NULL)

        loginUser = get_login_user(cookie)

        project = ProjectDAO.create_project(project_name, description, loginUser)
        if project:
            return self.response_format()

        else:
            return self.handle_error(SolidUIErrorType.CREATE_PROJECT_ERROR)

    @expose('/<int:pk>', methods=("PUT",))
    @safe
    def update(self, pk: int) -> FlaskResponse:
        """
        update project
        """
        project_name = request.form.get('projectName')
        background_image = request.form.get('backgroundImage')
        description = request.form.get('description')

        project = ProjectDAO.update_project(pk, project_name, background_image, description)
        if project:

            return self.response_format()

        else:
            return self.handle_error(SolidUIErrorType.UPDATE_PROJECT_ERROR)

    @expose('/queryProjectListPaging', methods=("GET",))
    @safe
    def query_Project_List_Paging(self) -> FlaskResponse:
        """
        query project list paging
        """
        search_name = request.args.get('searchName', default='')
        page_size = request.args.get('pageSize', default=10, type=int)
        page_no = request.args.get('pageNo', default=1, type=int)

        page_info = ProjectDAO.query_project_list_paging(search_name, page_no, page_size)

        page_info_schema = PageInfoSchema()

        return self.response_format(data=page_info_schema.dump(page_info))

    @expose('/<int:pk>', methods=("DELETE",))
    @safe
    def delete(self, pk: int) -> FlaskResponse:
        """
        delete project by id
        """
        ProjectDAO.delete_project(pk)
        return self.response_format()

    @expose('/<int:pk>', methods=("GET",))
    @safe
    def get(self, pk: int) -> FlaskResponse:
        """
        get project by id
        """
        project = ProjectDAO.get_project(pk)
        if project:
            project_schema = ProjectSchema()
            return self.response_format(data=project_schema.dump(project))

        else:

            return self.handle_error(SolidUIErrorType.PROJECT_NOT_EXISTS_ERROR)
