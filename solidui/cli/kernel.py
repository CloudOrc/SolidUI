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
import logging
import asyncio
import sys
from multiprocessing import Process
from flask.cli import with_appcontext
import click

from solidui.daos.exceptions import DAOException
from solidui.kernel_program.main import main as kernel_program_main, cleanup_kernel_program

logger = logging.getLogger(__name__)


def run_kernel_program():
    try:
        asyncio.run(kernel_program_main())
    except Exception as e:
        logging.exception("Error running the kernel_program:")
        sys.exit(1)


def print_banner():
    print("""
 ____        _ _     _ _   _ ___ __  __           _      _ 
/ ___|  ___ | (_) __| | | | |_ _|  \/  | ___   __| | ___| |
\___ \ / _ \| | |/ _` | | | || || |\/| |/ _ \ / _` |/ _ \ |
 ___) | (_) | | | (_| | |_| || || |  | | (_) | (_| |  __/ |
|____/ \___/|_|_|\__,_|\___/|___|_|  |_|\___/ \__,_|\___|_|
        """)

    print("")
    print("You can inspect detailed logs in app.log.")
    print("")


@click.command()
@with_appcontext
def kernel() -> None:
    kernel_program_process = Process(target=run_kernel_program)
    try:
        kernel_program_process.start()
        print_banner()
        kernel_program_process.join()
    except DAOException:
        print("Terminating processes...")
        cleanup_kernel_program()
        kernel_program_process.terminate()
        kernel_program_process.join()
        print("Processes terminated.")
