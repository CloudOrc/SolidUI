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

from typing import Any, Optional

from solidui.errors import SolidUIErrorType


class SolidUIException(Exception):
    status = 500
    message = ""

    def __init__(
        self,
        message: str = "",
        exception: Optional[Exception] = None,
        error_type: Optional[SolidUIErrorType] = None,
    ) -> None:
        if message:
            self.message = message
        self._exception = exception
        self._error_type = error_type
        super().__init__(self.message)

    @property
    def exception(self) -> Optional[Exception]:
        return self._exception

    @property
    def error_type(self) -> Optional[SolidUIErrorType]:
        return self._error_type

    def to_dict(self) -> dict[str, Any]:
        rv = {}
        if hasattr(self, "message"):
            rv["message"] = self.message
        if self.error_type:
            rv["error_type"] = self.error_type
        if self.exception is not None and hasattr(self.exception, "to_dict"):
            rv = {**rv, **self.exception.to_dict()}
        return rv