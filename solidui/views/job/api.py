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
from flask import request


from solidui.daos.exceptions import DAONotFound
from solidui.errors import SolidUIErrorType
from solidui.solidui_typing import FlaskResponse
from solidui.views.base_api import BaseSolidUIApi
from flask_appbuilder.api import expose, safe


logger = logging.getLogger(__name__)


class JobRestApi(BaseSolidUIApi):
    route_base = "/solidui/job"

    @expose('/save/page', methods=['POST'])
    @safe
    def save_page(self) -> FlaskResponse:
        job_element_page_data = request.json
        # Logic to create job element page
        # Return appropriate response
        return self.response_format()

    @expose('/update/page', methods=['PUT'])
    @safe
    def update_job_page(self) -> FlaskResponse:
        job_element_page_data = request.json
        # Logic to update job element page
        # Return appropriate response
        return self.response_format()

    @expose('/query/page', methods=['GET'])
    @safe
    def query_job_page(self) -> FlaskResponse:
        project_id = request.args.get('projectId')
        page_id = request.args.get('pageId')
        return self.response_format()

