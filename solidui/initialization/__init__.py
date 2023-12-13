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
import os
import sys
from typing import Any, Callable, TYPE_CHECKING
from deprecation import deprecated

import wtforms_json


if TYPE_CHECKING:
    from solidui.app import SolidUIApp

logger = logging.getLogger(__name__)

class SolidUIAppInitializer:
    def __init__(self, app: 'SolidUIApp') -> None:
        super().__init__()

        self.solidui_app = app
        self.config = app.config
        self.manifest: dict[Any, Any] = {}

    @deprecated(details="use self.solidui_app instead of self.flask_app")  # type: ignore
    @property
    def flask_app(self) -> 'SolidUIApp':
        return self.solidui_app


    def pre_init(self) -> None:
        """
        Called before all other init tasks are complete
        """
        wtforms_json.init()

        if not os.path.exists(self.config["DATA_DIR"]):
            os.makedirs(self.config["DATA_DIR"])

    def post_init(self) -> None:
        """
        Called after any other init tasks
        """

    def init_views(self) -> None:
        """
        We're doing local imports, as several of them import
        models which in turn try to import
        the global Flask app
        """

    def init_app(self) -> None:
        """
        Main entry point which will delegate to other methods in
        order to fully init the app
        """

        self.pre_init()
        self.init_views()
        self.post_init()


