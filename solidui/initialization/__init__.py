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
from flask_session import Session

from solidui.common.constants import CHANGE_ME_SECRET_KEY
from solidui.extensions import (
    appbuilder,
    db
)
from solidui.solidui_typing import FlaskResponse
from solidui.utils.base import pessimistic_connection_handling, is_test

if TYPE_CHECKING:
    from solidui.app import SolidUIApp

logger = logging.getLogger(__name__)

class SolidUIAppInitializer:
    def __init__(self, app: SolidUIApp) -> None:
        super().__init__()

        self.solidui_app = app
        self.config = app.config
        self.manifest: dict[Any, Any] = {}

    @deprecated(details="use self.solidui_app instead of self.flask_app")  # type: ignore
    @property
    def flask_app(self) -> SolidUIApp:
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

    def setup_db(self) -> None:
        db.init_app(self.solidui_app)
        with self.solidui_app.app_context():
            pessimistic_connection_handling(db.engine)

    def initialize_database(self) -> None:
        with self.solidui_app.app_context():
            db.create_all()

    def initialize_data(self) -> None:
        ...

    def configure_middlewares(self) -> None:
        if self.config["ENABLE_CORS"]:
            # pylint: disable=import-outside-toplevel
            from flask_cors import CORS

            CORS(self.solidui_app, **self.config["CORS_OPTIONS"])

    def init_views(self) -> None:
        """
        We're doing local imports, as several of them import
        models which in turn try to import
        the global Flask app
        """

        from solidui.example.api import ExampleRestApi
        from solidui.views.user.api import LoginRestApi
        from solidui.views.project.api import ProjectRestApi
        from solidui.views.model.api import ModelRestApi
        from solidui.views.datasource.api import DataSourceRestApi
        from solidui.views.metadata.api import MetadataQueryRestApi
        from solidui.views.job.api import JobRestApi
        from solidui.views.job_page.api import JobPageRestApi

        appbuilder.add_api(ExampleRestApi)
        appbuilder.add_api(LoginRestApi)
        appbuilder.add_api(ProjectRestApi)
        appbuilder.add_api(ModelRestApi)
        appbuilder.add_api(DataSourceRestApi)
        appbuilder.add_api(MetadataQueryRestApi)
        appbuilder.add_api(JobRestApi)
        appbuilder.add_api(JobPageRestApi)

        for rule in self.solidui_app.url_map.iter_rules():
            print(rule)


    def configure_fab(self) -> None:
        if self.config["SILENCE_FAB"]:
            logging.getLogger("flask_appbuilder").setLevel(logging.ERROR)


        appbuilder.init_app(self.solidui_app, db.session)



    def configure_session(self) -> None:
        if self.config["SESSION_SERVER_SIDE"]:
            Session(self.solidui_app)

    def init_app_in_ctx(self) -> None:

        self.configure_fab()

        if flask_app_mutator := self.config["FLASK_APP_MUTATOR"]:
            flask_app_mutator(self.solidui_app)

        self.init_views()

    def check_secret_key(self) -> None:
        def log_default_secret_key_warning() -> None:
            top_banner = 80 * "-" + "\n" + 36 * " " + "WARNING\n" + 80 * "-"
            bottom_banner = 80 * "-" + "\n" + 80 * "-"
            logger.warning(top_banner)
            logger.warning(
                "A Default SECRET_KEY was detected, please use solidui_config.py "
                "to override it.\n"
                "Use a strong complex alphanumeric string and use a tool to help"
                " you generate \n"
                "a sufficiently random sequence, ex: openssl rand -base64 42"
            )
            logger.warning(bottom_banner)

        if self.config["SECRET_KEY"] == CHANGE_ME_SECRET_KEY:
            if (
                    self.solidui_app.debug
                    or self.solidui_app.config["TESTING"]
                    or is_test()
            ):
                logger.warning("Debug mode identified with default secret key")
                log_default_secret_key_warning()
                return
            log_default_secret_key_warning()
            logger.error("Refusing to start due to insecure SECRET_KEY")
            sys.exit(1)

    def init_app(self) -> None:
        """
        Main entry point which will delegate to other methods in
        order to fully init the app
        """

        self.pre_init()
        self.check_secret_key()
        self.configure_session()
        self.setup_db()
        self.initialize_database()
        self.configure_middlewares()

        with self.solidui_app.app_context():
            self.init_app_in_ctx()

        self.post_init()

