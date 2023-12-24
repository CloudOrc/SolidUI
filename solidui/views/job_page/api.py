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


class JobPageRestApi(BaseSolidUIApi):
    route_base = "/solidui/job/page"

    @expose('', methods=('POST'))
    @safe
    def create_job_page(self) -> FlaskResponse:
        # Extract data from request

        return self.response_format()

    @expose('/<int:id>', methods=('PUT'))
    @safe
    def update_job_page(self, id) -> FlaskResponse:
        """
        update job page
        """
        return self.response_format()

    @expose('/<int:id>', methods=('DELETE'))
    @safe
    def delete_job_page(self, id) -> FlaskResponse:
        """
        delete job page
        """
        return self.response_format()

    @expose('/query/<int:project_id>', methods=('GET'))
    @safe
    def get_job_pages(self, project_id) -> FlaskResponse:
        """
        get job page
        """
        return self.response_format()
