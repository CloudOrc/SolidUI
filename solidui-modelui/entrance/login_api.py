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

from flask import request, jsonify, make_response
from utils import encrypt
from exceptions import ApiException


class LoginAPI:

    def __init__(self, user_service):
        self.user_service = user_service

    def login(self):
        username = request.args.get('username')
        password = request.args.get('password')

        if not username:
            raise ApiException(Status.USER_NAME_NULL)

        if not password:
            raise ApiException(Status.PASSWORD_NAME_NULL)

        user = self.user_service.get_user(username, encrypt(password))
        if not user:
            raise ApiException(Status.USER_LOGIN_FAILURE)

        response = jsonify(Success(user))
        response.set_cookie('user', user.id)
        return response

    def logout(self):
        response = jsonify(Success())
        response.delete_cookie('user')
        return response


import hashlib


class UserService:

    def __init__(self, user_mapper):
        self.user_mapper = user_mapper

    def get_user(self, username, password):
        password_md5 = encrypt(password)
        return self.user_mapper.query_user(username, password_md5)


def encrypt(raw_str):
    return hashlib.md5(raw_str.encode('utf-8')).hexdigest()


@app.route('/login', methods=['GET'])
def login():
    login_controller = LoginAPI(UserService())
    return login_controller.login()


@app.route('/logout', methods=['POST'])
def logout():
    login_controller = LoginAPI(UserService())
    return login_controller.logout()



