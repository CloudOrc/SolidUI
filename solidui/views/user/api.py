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

from flask import request, make_response
from flask_appbuilder.api import expose, protect, safe, BaseApi

from solidui.extensions import db
from solidui.daos.user import UserDao
from solidui.solidui_typing import FlaskResponse
from solidui.views.base_api import BaseSolidUIApi
from solidui.utils.encryption_utils import get_md5
from solidui.utils.login_utils import set_login_user, remove_login_user
logger = logging.getLogger(__name__)


class LoginRestApi(BaseSolidUIApi):

    route_base = "/solidui"

    @expose('/login', methods=("GET",))
    @safe
    def login(self) -> FlaskResponse:

        username = request.args.get("username")
        password = request.args.get("password")

        if username is None or password is None:
            return self.response_format(code=400, msg="Missing username or password", success=False, failed=True)

        user = UserDao.queryUserByNamePassword(db.session, username, get_md5(password))

        login_resp = set_login_user(user.user_name)

        response_data = self.response_format()
        resp = make_response(response_data)
        for key, value in login_resp.headers:
            if key.lower() == 'set-cookie':
                resp.headers.set(key, value)

        return resp

    @expose('/loginOut', methods=("POST",))
    @safe
    def signOut(self) -> FlaskResponse:

        cookie = request.cookies
        if cookie is None:
            return self.response_format(code=400, msg="Missing cookie", success=False, failed=True)

        login_resp = remove_login_user(cookie)
        response_data = self.response_format()
        resp = make_response(response_data)
        for key, value in login_resp.headers:
            if key.lower() == 'set-cookie':
                resp.headers.set(key, value)
        return resp
