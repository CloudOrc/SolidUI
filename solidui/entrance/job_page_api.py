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
from services import JobPageService
from exceptions import ApiException
from typing import List, Optional

from models import JobPage
from repositories import JobPageRepository
from exceptions import (
    JobPageNotFound,
    ParentPageNotFound,
    DuplicatePageNameError
)
class JobPageController:

    def __init__(self, service: JobPageService):
        self.service = service

    def create(self):
        data = request.get_json()
        try:
            result = self.service.create(data)
            return jsonify(result), 201
        except ApiException as e:
            return jsonify({'message': str(e)}), e.status_code

    def update(self, page_id):
        data = request.get_json()
        try:
            result = self.service.update(page_id, data)
            return jsonify(result), 200
        except ApiException as e:
            return jsonify({'message': str(e)}), e.status_code

    def delete(self, page_id):
        try:
            self.service.delete(page_id)
            return jsonify(), 204
        except ApiException as e:
            return jsonify({'message': str(e)}), e.status_code

    def get_by_project(self, project_id):
        try:
            pages = self.service.get_by_project(project_id)
            return jsonify(pages), 200
        except ApiException as e:
            return jsonify({'message': str(e)}), e.status_code





class JobPageService:

    def __init__(self, repo: JobPageRepository):
        self.repo = repo

    def create(self, data: dict) -> JobPage:
        name = data['name']

        if self.repo.get_by_name(name):
            raise DuplicatePageNameError()

        page = JobPage(
            name=name,
            project_id=data['project_id'],
            order=data['order'],
            parent_id=data.get('parent_id'),
            layout=data.get('layout')
        )

        return self.repo.insert(page)

    def update(self, page_id: int, data: dict) -> JobPage:
        page = self.repo.get(page_id)

        if not page:
            raise JobPageNotFound()

        page.name = data.get('name', page.name)
        page.order = data.get('order', page.order)
        page.parent_id = data.get('parent_id', page.parent_id)
        page.layout = data.get('layout', page.layout)

        if page.parent_id and not self.repo.get(page.parent_id):
            raise ParentPageNotFound()

        self.repo.update(page)
        return page

    def delete(self, page_id: int) -> None:
        self.repo.delete(page_id)

    def get_by_project(self, project_id: int) -> List[JobPage]:
        pages = self.repo.get_by_project(project_id)
        return self._nest_pages(pages)

    def _nest_pages(self, pages: List[JobPage]) -> List[JobPage]:
        # Implementation to nest child pages under parents

        return nested_pages
