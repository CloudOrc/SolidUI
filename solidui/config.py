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

# The SQLAlchemy connection string.
SQLALCHEMY_DATABASE_URI = (
    f"""sqlite:///{os.path.join(DATA_DIR, "solidui.db")}?check_same_thread=false"""
)

# SQLALCHEMY_CUSTOM_PASSWORD_STORE = lookup_password
SQLALCHEMY_CUSTOM_PASSWORD_STORE = None