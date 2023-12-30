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
import asyncio
import logging
import os

import requests
from flask import request, send_from_directory
from solidui.daos.exceptions import DAONotFound, DAOCreateFailedError
from solidui.daos.model_type import ModelTypeDAO
from solidui.entity.core import ModelType
from solidui.errors import SolidUIErrorType
from solidui.solidui_typing import FlaskResponse
from solidui.views.base_api import BaseSolidUIApi
from flask_appbuilder.api import expose, safe
from solidui.kernel_program.main import APP_PORT as KERNEL_APP_PORT
from solidui.views.model.schemas import ModelKeyVO, ModelTypePageInfoSchema
from solidui.views.utils import get_code, add_prompt_type_buffer

logger = logging.getLogger(__name__)


class ModelRestApi(BaseSolidUIApi):
    route_base = "/solidui/models"

    @expose('/list', methods=('GET',))
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

    @expose('/api/<path:path>', methods=('GET', 'POST'))
    @safe
    def proxy_kernel_manager(self, path) -> FlaskResponse:
        if request.method == "POST":
            resp = requests.post(
                f'http://localhost:{KERNEL_APP_PORT}/solidui/kernel/{path}', json=request.get_json())
        else:
            resp = requests.get(f'http://localhost:{KERNEL_APP_PORT}/solidui/kernel/{path}')

        excluded_headers = ['content-encoding',
                            'content-length', 'transfer-encoding', 'connection']
        headers = [(name, value) for (name, value) in resp.raw.headers.items()
                   if name.lower() not in excluded_headers]

        return self.response_format(code=resp.status_code, data=resp.content.decode('utf-8'))

    @expose('/generate', methods=('POST',))
    @safe
    def generate_code(self) -> FlaskResponse:
        user_prompt = request.json.get('prompt', "")
        model_id = request.json.get('modelId', 0)

        logger.info(f'Prompt: {user_prompt}, Model Id: {model_id}')

        model_types = ModelTypeDAO.find_by_id(model_id)

        user_key = model_types.token
        base_url = model_types.baseurl
        model = model_types.name
        type_name = model_types.type_name
        gpt_prompt = model_types.prompt
        model_code = model_types.code

        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        if type_name == 'gpt':
            code, status = loop.run_until_complete(
                get_code(gpt_prompt, user_prompt, model_code, user_key, model, base_url))
            loop.close()
        else:
            code, status = loop.run_until_complete(
                get_code(gpt_prompt, user_prompt, model_code, user_key, model, base_url))
            loop.close()

        # Append all messages to the message buffer for later use
        add_prompt_type_buffer(user_prompt, model_code)

        return self.response_format(code=status, data={'code': code})

    @expose('/download', methods=('GET',))
    @safe
    def download_file(self) -> FlaskResponse:
        # Get query argument file
        file = request.args.get('file')
        # from `workspace/` send the file
        # make sure to set required headers to make it download the file
        return send_from_directory(os.path.join(os.getcwd(), 'workspace'), file, as_attachment=True)

    @expose('/model_types', methods=('GET',))
    @safe
    def query_model_types(self) -> FlaskResponse:
        rows = int(request.args.get('rows', 10))
        page = int(request.args.get('page', 1))

        page_info = ModelTypeDAO.get_model_types(page, rows)

        page_info_schema = ModelTypePageInfoSchema()
        return self.response_format(data=page_info_schema.dump(page_info))

    @expose('/model_types', methods=('POST',))
    @safe
    def create_model_type(self) -> FlaskResponse:
        data = request.get_json()
        model_type = ModelType(**data)

        try:
            ModelTypeDAO.create(model_type)
            return self.response_format()
        except DAOCreateFailedError as ex:
            logger.exception(ex)
            return self.handle_error(SolidUIErrorType.CREATE_MODEL_TYPE_ERROR)

    @expose('/model_types/<int:pk>', methods=('DELETE',))
    @safe
    def delete_model_type(self, pk) -> FlaskResponse:

        try:
            model_type = ModelTypeDAO.find_by_id(pk)
            if model_type:
                return self.handle_error(SolidUIErrorType.QUERY_MODEL_TYPE_ERROR)

            ModelTypeDAO.delete_model_type(pk)
            return self.response_format()
        except DAOCreateFailedError as ex:
            logger.exception(ex)
            return self.handle_error(SolidUIErrorType.DELETE_MODEL_TYPE_ERROR)

    @expose('/model_types/<int:pk>', methods=('GET',))
    @safe
    def get_model_type_by_id(self,pk) -> FlaskResponse:

        model_type = ModelTypeDAO.find_by_id(pk)
        if model_type:
            return self.handle_error(SolidUIErrorType.QUERY_MODEL_TYPE_ERROR)

        return self.response_format(data=model_type)

    @expose('/model_types', methods=('PUT',))
    @safe
    def update_model_type(self) -> FlaskResponse:
        data = request.get_json()
        model_type = ModelType(**data)

        new_model_type = ModelTypeDAO.find_by_id(model_type.id)
        if new_model_type:
            return self.handle_error(SolidUIErrorType.QUERY_MODEL_TYPE_ERROR)

        try:
            ModelTypeDAO.update(model_type)
            return self.response_format()
        except DAOCreateFailedError as ex:
            logger.exception(ex)
            return self.handle_error(SolidUIErrorType.UPDATE_MODEL_TYPE_ERROR)


