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

from __future__ import annotations
import logging

from flask import request, jsonify, Response
from flask_appbuilder.api import BaseApi, expose, protect, rison, safe
from typing import Any, Union
from solidui.schemas import error_payload_content
from solidui.extensions import stats_logger_manager

logger = logging.getLogger(__name__)


class BaseSolidUIApiMixin:
    csrf_exempt = False

    responses = {
        "400": {"description": "Bad request", "content": error_payload_content},
        "401": {"description": "Unauthorized", "content": error_payload_content},
        "403": {"description": "Forbidden", "content": error_payload_content},
        "404": {"description": "Not found", "content": error_payload_content},
        "410": {"description": "Gone", "content": error_payload_content},
        "422": {
            "description": "Could not process entity",
            "content": error_payload_content,
        },
        "500": {"description": "Fatal error", "content": error_payload_content},
    }

    def incr_stats(self, action: str, func_name: str) -> None:
        """
        Proxy function for statsd.incr to impose a key structure for REST API's
        :param action: String with an action name eg: error, success
        :param func_name: The function name
        """
        stats_logger_manager.instance.incr(
            f"{self.__class__.__name__}.{func_name}.{action}"
        )

    def timing_stats(self, action: str, func_name: str, value: float) -> None:
        """
        Proxy function for statsd.incr to impose a key structure for REST API's
        :param action: String with an action name eg: error, success
        :param func_name: The function name
        :param value: A float with the time it took for the endpoint to execute
        """
        stats_logger_manager.instance.timing(
            f"{self.__class__.__name__}.{func_name}.{action}", value
        )

    def send_stats_metrics(
            self, response: Response, key: str, time_delta: float | None = None
    ) -> None:
        """
        Helper function to handle sending statsd metrics
        :param response: flask response object, will evaluate if it was an error
        :param key: The function name
        :param time_delta: Optional time it took for the endpoint to execute
        """
        if 200 <= response.status_code < 400:
            self.incr_stats("success", key)
        elif 400 <= response.status_code < 500:
            self.incr_stats("warning", key)
        else:
            self.incr_stats("error", key)
        if time_delta:
            self.timing_stats("time", key, time_delta)

    @staticmethod
    def response_format(code=0, msg="success", data={}, success=True, failed=False) -> Union[dict, Any]:
        """Unified response statistics method"""
        response = {
            "code": code,
            "msg": msg,
            "data": data,
            "success": success,
            "failed": failed
        }
        return jsonify(response)


class BaseSolidUIApi(BaseSolidUIApiMixin, BaseApi):
    ...
