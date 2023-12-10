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
from modelui.datasource_plugin.base_jdbc_client import BaseJdbcClient

import mysql.connector


class MysqlClient(BaseJdbcClient):

    def __init__(self, conn):
        super().__init__(conn)

    def generate_select_all_data_sql(self, database, table_name):
        return f"SELECT * FROM {database}.{table_name}"

    def get_all_databases(self):
        cursor = self.conn.cursor()
        cursor.execute("SHOW DATABASES")
        return [db[0] for db in cursor]

    def get_all_tables(self, database):
        cursor = self.conn.cursor()
        cursor.execute(f"SHOW TABLES FROM {database}")
        return [table[0] for table in cursor]

    def get_select_result(self, sql):
        cursor = self.conn.cursor()
        cursor.execute(sql)

        # 获取列名
        column_names = [col[0] for col in cursor.description]

        results = []
        results.append(column_names)

        # 获取结果
        for row in cursor:
            results.append(list(row))

        return results