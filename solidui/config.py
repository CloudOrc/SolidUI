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

from datetime import timedelta
from typing import Any

from solidui.utils.logging_configurator import DefaultLoggingConfigurator

logger = logging.getLogger(__name__)

if "SOLIDUI_HOME" in os.environ:
    DATA_DIR = os.environ["SOLIDUI_HOME"]
else:
    DATA_DIR = os.path.expanduser("~/.solidui")

SOLIDUI_WEBSERVER_PROTOCOL = "http"
SOLIDUI_WEBSERVER_ADDRESS = "0.0.0.0"
SOLIDUI_WEBSERVER_PORT = 8088

SOLIDUI_WEBSERVER_TIMEOUT = int(timedelta(minutes=1).total_seconds())

VERSION_STRING = "0.5.0"

SILENCE_FAB = True
FLASK_APP_MUTATOR = None
SQLALCHEMY_TRACK_MODIFICATIONS = False
SESSION_SERVER_SIDE = False
FAB_API_SWAGGER_UI = True
FAB_API_SWAGGER = True
# The SQLAlchemy connection string.
# SQLALCHEMY_DATABASE_URI = (f"""sqlite:///{os.path.join(DATA_DIR, "solidui.db")}?check_same_thread=false""")

SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://username:password@host:port/dbname'



# SQLALCHEMY_CUSTOM_PASSWORD_STORE = lookup_password
SQLALCHEMY_CUSTOM_PASSWORD_STORE = None

# Default configurator will consume the LOG_* settings below
LOGGING_CONFIGURATOR = DefaultLoggingConfigurator()

# Console Log Settings

LOG_FORMAT = "%(asctime)s:%(levelname)s:%(name)s:%(message)s"
LOG_LEVEL = "DEBUG"

DB_HOST = 'localhost'
DB_PORT = 3306
DB_NAME = 'solidui'
DB_USER = 'root'
DB_PASS = 'SolidUI@123'
API_PORT = 5010
WEB_PORT = 5110
SNAKEMQ_PORT = 8765
SNAKEMQ_LISTENER = '127.0.0.1'
SNAKEMQ_CONNECTOR = '127.0.0.1'

ENABLE_CORS = True
CORS_OPTIONS: dict[Any, Any] = {}
