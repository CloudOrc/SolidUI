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