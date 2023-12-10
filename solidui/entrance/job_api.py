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
from service import JobService
from dataclasses import dataclass
from typing import List, Optional

import json

class JobController:

    def __init__(self, job_service: JobService):
        self.service = job_service

    def create(self):
        data = request.get_json()
        try:
            job = self._build_job(data)
            self.service.create_job(job)
            return jsonify({'message': 'Job created'}), 201
        except ValueError as e:
            return jsonify({'message': str(e)}), 400

    def update(self, job_id):
        data = request.get_json()
        try:
            job = self._build_job(data, job_id)
            self.service.update_job(job)
            return jsonify({'message': 'Job updated'}), 200
        except ValueError as e:
            return jsonify({'message': str(e)}), 400

    def get(self, project_id, page_id):
        job = self.service.get_job(project_id, page_id)
        return jsonify(job), 200

    def _build_job(self, data, job_id=None):
        # Construct and validate Job from input data
        return job


class JobService:

    def __init__(self, project_repo, element_repo, page_repo):
        self.project_repo = project_repo
        self.element_repo = element_repo
        self.page_repo = page_repo

    def create_job(self, job):
        # Validate
        if not job.project_id:
            raise ValueError('Project ID required')

        if not job.page:
            raise ValueError('Page required')

        if job.views is None:
            # No views, create empty job
            self._create_empty_job(job)
            return

        # Create elements
        element_ids = []
        for view in job.views:
            element = self._create_element(view, job.project_id)
            element_ids.append(element.id)

        # Create pages
        for element_id in element_ids:
            self._create_page(job.page.id, element_id, job.size)

    def _create_empty_job(self, job):
        # Just create page without elements
        page = JobPage(
            id=job.page.id,
            project_id=job.project_id,
            size=job.size
        )
        self.page_repo.insert(page)

    def _create_element(self, view, project_id):
        element = JobElement(
            name=view.title,
            type=view.type,
            project_id=project_id,
            data=self._convert_to_json(view)
        )
        return self.element_repo.insert(element)

    def _create_page(self, page_id, element_id, size):
        page = JobPage(
            id=page_id,
            element_id=element_id,
            size=size
        )

        self.page_repo.insert(page)

    def _convert_to_json(self, view):
        data = {
            'position': view.position,
            'size': view.size,
            'options': view.options,
            'data': view.data
        }
        return json.dumps(data)


@dataclass
class Job:
    project_id: int
    page: Page
    size: Size
    views: List[View]  # Optional


@dataclass
class Page:
    id: int


@dataclass
class Size:
    width: int
    height: int

@app.route('/jobs', methods=['POST'])
def create_job():
    controller = JobController(JobService())
    return controller.create()


@app.route('/jobs/<int:job_id>', methods=['PUT'])
def update_job(job_id):
    controller = JobController(JobService())
    return controller.update(job_id)


@app.route('/jobs/<int:project_id>/<int:page_id>')
def get_job(project_id, page_id):
    controller = JobController(JobService())
    return controller.get(project_id, page_id)