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
from abc import ABC, abstractmethod


class BaseJdbcClient(ABC):

    def __init__(self, conn):
        self.conn = conn
        self.logger = logging.getLogger(__name__)

    def close_resource(self, connection, statement, result_set):
        try:
            if result_set is not None and not result_set.closed:
                result_set.close()
            if statement is not None and not statement.closed:
                statement.close()
            if connection is not None and not connection.closed:
                connection.close()
        except Exception as e:
            self.logger.warn(f"Failed to release resources: {e}")

    def close(self):
        self.close_resource(self.conn, None, None)

    @abstractmethod
    def generate_select_all_data_sql(self, database, table_name):
        pass

    @abstractmethod
    def get_all_databases(self):
        pass

    @abstractmethod
    def get_all_tables(self, database):
        pass

    @abstractmethod
    def get_select_result(self, sql):
        pass

    def get_conn(self):
        return self.conn
