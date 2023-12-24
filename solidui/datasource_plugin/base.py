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
from abc import abstractmethod, ABC
from concurrent.futures import ThreadPoolExecutor
import MySQLdb


# Base classes
class BaseJdbcClient(ABC):
    def __init__(self, conn):
        self.conn = conn

    @abstractmethod
    def get_databases(self):
        pass

    @abstractmethod
    def get_tables(self, database):
        pass

    @abstractmethod
    def run_query(self, sql):
        pass

    @abstractmethod
    def generate_select_all_data_sql(self, database, table_name):
        pass

    def close(self):
        self.conn.close()


class JdbcClientFactory(ABC):
    executor = ThreadPoolExecutor(max_workers=10)

    @staticmethod
    def create_client(db_type, host, port, username, password, database, extra_params=None) -> BaseJdbcClient:
        if extra_params is None:
            extra_params = {}
        if db_type == 'mysql':
            conn = MySQLdb.connect(
                host=host,
                port=port,
                user=username,
                passwd=password,
                db=database,
                **extra_params
            )

            return MySQLClient(conn)
        else:
            raise ValueError("Unsupported database type")

    @staticmethod
    def run_query(client, sql: str):
        def query():
            try:
                return client.run_query(sql)
            finally:
                client.close()

        future = JdbcClientFactory.executor.submit(query)
        return future.result()

    @staticmethod
    def get_databases(client):
        def query():
            try:
                return client.get_databases()
            finally:
                client.close()

        future = JdbcClientFactory.executor.submit(query)
        return future.result()

    @staticmethod
    def get_tables(client, database: str):
        def query():
            try:
                return client.get_tables(database)
            finally:
                client.close()

        future = JdbcClientFactory.executor.submit(query)
        return future.result()



class MySQLClient(BaseJdbcClient):
    def get_databases(self):
        cursor = self.conn.cursor()
        cursor.execute("SHOW DATABASES")
        return [db[0] for db in cursor]

    def get_tables(self, database):
        cursor = self.conn.cursor()
        cursor.execute(f"SHOW TABLES FROM {database}")
        return [table[0] for table in cursor]

    def run_query(self, sql):
        cursor = self.conn.cursor()
        cursor.execute(sql)
        column_names = [col[0] for col in cursor.description]
        rows = [column_names]  # First row is column names

        for row in cursor.fetchall():
            rows.append([str(col) if col is not None else None for col in row])

        return rows

    def generate_select_all_data_sql(self, database, table_name):
        return f"SELECT * FROM {database}.{table_name}"
