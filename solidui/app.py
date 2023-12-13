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

import logging
import os
from typing import Optional

from flask import Flask

from solidui.initialization import SolidUIAppInitializer

logger = logging.getLogger(__name__)

def create_app(solidui_config_module: Optional[str] = None) -> Flask:
    app = SolidUIApp(__name__)
    print("测试create_app")
    try:
        # Allow user to override our config completely
        config_module = solidui_config_module or os.environ.get(
            "SOLIDUI_CONFIG", "solidui.config"
        )
        app.config.from_object(config_module)

        app_initializer = app.config.get("APP_INITIALIZER", SolidUIAppInitializer)(app)
        app_initializer.init_app()

        return app

    # Make sure that bootstrap errors ALWAYS get logged
    except Exception as ex:
        logger.exception("Failed to create app")
        raise ex

class SolidUIApp(Flask):
    pass


