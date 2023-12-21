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

import pymysql


def response_format(code=0,msg="success",data={},success=True,failed=False):
    return {
        "code": code,
        "msg": msg,
        "data": data,
        "success": success,
        "failed": failed
    }


def query_model(db_host='localhost',db_port=3306,db_user='root',db_pass='password', db_name='testdb', model_id=0):

    conn = pymysql.connect(host=db_host, port=db_port, user=db_user, passwd=db_pass, db=db_name, cursorclass=pymysql.cursors.DictCursor)

    cursor = conn.cursor()

    cursor.execute("SELECT * FROM solidui_model_type WHERE id = %s", model_id)

    result = cursor.fetchone()

    cursor.close()
    conn.close()

    return result

