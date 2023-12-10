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

from enums import Status

class BaseResponse:

    def __init__(self):
        self.code = None
        self.message = None
        self.data = None

    @staticmethod
    def success(data=None):
        resp = BaseResponse()
        resp.code = Status.SUCCESS.value
        resp.message = Status.SUCCESS.name
        resp.data = data
        return resp

    @staticmethod
    def error(error_code, message):
        resp = BaseResponse()
        resp.code = error_code
        resp.message = message
        return resp

class BaseController:

    def handle_success(self, data=None):
        return BaseResponse.success(data)

    def handle_error(self, error_code, message):
        return BaseResponse.error(error_code, message)