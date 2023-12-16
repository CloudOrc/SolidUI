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

import importlib
import logging
import pkgutil
from typing import Any

import click
from colorama import Fore, Style
from flask.cli import FlaskGroup, with_appcontext
from solidui import app, cli
from solidui.app import create_app
from solidui.cli.lib import normalize_token
from solidui.extensions import db


def create_solidui_app():

    return create_app()

@click.group(
    cls=FlaskGroup,
    create_app=create_solidui_app,
    context_settings={"token_normalize_func": normalize_token},
)
@with_appcontext
def solidui() -> None:
    """This is a management script for the SolidUI application."""

    @app.shell_context_processor
    def make_shell_context() -> dict[str, Any]:
        return {"app": app, "db": db}



# add sub-commands
for load, module_name, is_pkg in pkgutil.walk_packages(
    cli.__path__, cli.__name__ + "."
):
    module = importlib.import_module(module_name)
    for attribute in module.__dict__.values():
        if isinstance(attribute, (click.core.Command, click.core.Group)):
            solidui.add_command(attribute)

            if isinstance(attribute, click.core.Group):
                break

@solidui.command()
@with_appcontext
def init() -> None:
    ...


@solidui.command()
@with_appcontext
@click.option("--verbose", "-v", is_flag=True, help="Show extra information")
def version(verbose: bool) -> None:
    print("")
    """Prints the current version number"""
    print(Fore.BLUE + "-=" * 15)
    print(Fore.YELLOW + "SolidUI " + Fore.CYAN + f"{app.config['VERSION_STRING']}")
    print(Fore.BLUE + "-=" * 15)
    if verbose:
        print("[DB] : " + f"{db.engine}")
    print(Style.RESET_ALL)

@solidui.command()
@with_appcontext
def run():
    print("测试1")
    """Run the Superset web server."""
    app = create_solidui_app()
    host = app.config.get("SOLIDUI_WEBSERVER_ADDRESS", "0.0.0.0")
    port = app.config.get("SOLIDUI_WEBSERVER_PORT", 8088)
    app.run(host=host, port=port)



if __name__ == "__main__":
    solidui()
