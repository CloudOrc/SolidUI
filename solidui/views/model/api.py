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
from solidui.daos.model_type import ModelTypeDAO
from solidui.errors import SolidUIErrorType
from solidui.solidui_typing import FlaskResponse
from solidui.views.base_api import BaseSolidUIApi
from flask_appbuilder.api import expose, safe

from solidui.views.model.schemas import ModelKeyVO

logger = logging.getLogger(__name__)


class ModelRestApi(BaseSolidUIApi):
    route_base = "/solidui/models"


    ## soliduimodelui/webapp

    @expose('/list', methods=("GET",))
    @safe
    def get_model_list(self) -> FlaskResponse:
        """
        keys list
        """
        model_types = ModelTypeDAO.get_list()
        model_key_vos = []

        for m in model_types:
            model_key_vos.append(ModelKeyVO(m.id, f"{m.name}_{m.code}", m.type_name))

        return self.response_format(data=model_key_vos)


