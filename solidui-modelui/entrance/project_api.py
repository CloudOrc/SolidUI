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


from flask import request, jsonify
from utils import get_login_user
from exceptions import ApiException
from enums import Status
from constants import DEFAULT_PAGE_SIZE, DEFAULT_PAGE_NO


class ProjectController:

    def __init__(self, project_service):
        self.project_service = project_service

    def create_project(self):
        data = request.get_json()
        name = data.get('name')
        description = data.get('description')

        if not name:
            raise ApiException(Status.CREATE_PROJECT_ERROR)

        user = get_login_user(request)
        return self.project_service.create_project(user, name, description)

    def update_project(self, project_id):
        data = request.get_json()
        name = data.get('name')
        image = data.get('image')
        description = data.get('description')

        if not project_id:
            raise ApiException(Status.UPDATE_PROJECT_ERROR)

        return self.project_service.update_project(project_id, name, image, description)

    def get_project_list(self):
        search = request.args.get('search')
        page_size = request.args.get('page_size', DEFAULT_PAGE_SIZE)
        page_no = request.args.get('page_no', DEFAULT_PAGE_NO)

        return self.project_service.get_project_list(search, page_no, page_size)

    def delete_project(self, project_id):
        if not project_id:
            raise ApiException(Status.DELETE_PROJECT_ERROR)

        return self.project_service.delete_project(project_id)

    def get_project(self, project_id):
        if not project_id:
            raise ApiException(Status.PROJECT_NOT_EXISTS_ERROR)

        return self.project_service.get_project(project_id)


class ProjectService:

    def __init__(self, project_dao, user_service):
        self.project_dao = project_dao
        self.user_service = user_service

    def create_project(self, user_id, name, description):

        # 验证用户是否存在
        user = self.user_service.get_user_by_id(user_id)
        if not user:
            raise UserNotFoundException()

        # 参数校验
        if not name:
            raise ParameterValidationException()

        if len(name) > 50:
            raise ParameterValidationException('Project name too long')

        # 创建项目
        project = {
            'user_id': user_id,
            'name': name,
            'description': description
        }

        project_id = self.project_dao.insert(project)

        # 记录日志
        self.log_service.info(f"Project {project_id} created by {user_id}")

        return project_id

    def update_project(self, project_id, name, image, description):
        project = self.project_dao.get(project_id)
        if not project:
            raise ProjectNotFoundException()

        project['name'] = name
        project['image'] = image
        project['description'] = description

        self.project_dao.update(project_id, project)
        return Success()

    def get_project_list(self, search, page_no, page_size):
        projects = self.project_dao.query(search, page_no, page_size)
        total = self.project_dao.count(search)

        data = {
            'items': projects,
            'total': total
        }
        return Success(data)

    def delete_project(self, project_id):
        project = self.project_dao.get(project_id)
        if not project:
            raise ProjectNotFoundException()

        self.project_dao.delete(project_id)
        return Success()

    def get_project(self, project_id):
        project = self.project_dao.get(project_id)
        if not project:
            raise ProjectNotFoundException()

        return Success(project)

class ProjectNotFoundException(Exception):
    def __init__(self, message='Project not found'):
        self.message = message
        super().__init__(self.message)

@app.route('/projects', methods=['POST'])
def create_project():
    controller = ProjectController(ProjectService())
    return controller.create_project()


@app.route('/projects/<int:project_id>', methods=['PUT'])
def update_project(project_id):
    controller = ProjectController(ProjectService())
    return controller.update_project(project_id)

@app.route('/projects', methods=['GET'])
def get_project_list():
    controller = ProjectController(ProjectService())
    return controller.get_project_list()

@app.route('/projects/<int:project_id>', methods=['DELETE'])
def delete_project(project_id):
    controller = ProjectController(ProjectService())
    return controller.delete_project(project_id)

@app.route('/projects/<int:project_id>', methods=['GET'])
def get_project(project_id):
    controller = ProjectController(ProjectService())
    return controller.get_project(project_id)