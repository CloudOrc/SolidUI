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
from __future__ import annotations

import sqlite3
from typing import Any
from contextlib import closing
from sqlalchemy import event, exc, select
from sqlalchemy.engine import Connection, Engine


def pessimistic_connection_handling(some_engine: Engine) -> None:
    @event.listens_for(some_engine, "engine_connect")
    def ping_connection(connection: Connection, branch: bool) -> None:
        if branch:

            return

        save_should_close_with_result = connection.should_close_with_result
        connection.should_close_with_result = False

        try:
            # run a SELECT 1.   use a core select() so that
            # the SELECT of a scalar value without a table is
            # appropriately formatted for the backend
            connection.scalar(select([1]))
        except exc.DBAPIError as err:
            # catch SQLAlchemy's DBAPIError, which is a wrapper
            # for the DBAPI's exception.  It includes a .connection_invalidated
            # attribute which specifies if this connection is a 'disconnect'
            # condition, which is based on inspection of the original exception
            # by the dialect in use.
            if err.connection_invalidated:
                # run the same SELECT again - the connection will re-validate
                # itself and establish a new connection.  The disconnect detection
                # here also causes the whole connection pool to be invalidated
                # so that all stale connections are discarded.
                connection.scalar(select([1]))
            else:
                raise
        finally:
            # restore 'close with result'
            connection.should_close_with_result = save_should_close_with_result

    if some_engine.dialect.name == "sqlite":

        @event.listens_for(some_engine, "connect")
        def set_sqlite_pragma(  # pylint: disable=unused-argument
            connection: sqlite3.Connection,
            *args: Any,
        ) -> None:

            with closing(connection.cursor()) as cursor:
                cursor.execute("PRAGMA foreign_keys=ON")