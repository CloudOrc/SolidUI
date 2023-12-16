# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.


import logging

from flask_appbuilder.api import expose, protect, safe, BaseApi

from solidui.solidui_typing import FlaskResponse
from solidui.views.base_api import BaseSolidUIApi

logger = logging.getLogger(__name__)


class ExampleRestApi(BaseSolidUIApi):
    # allow_browser_login = True
    # class_permission_name = "Example"
    # resource_name = "example"
    # openapi_spec_tag = "Example"
    route_base = "/solidui"

    @expose('/greeting')
    def greeting(self, datasource_type: str = None
    ) -> FlaskResponse:

        logger.info("greeting")
        logger.debug("greeting")
        return self.response(200, message="Hello")
