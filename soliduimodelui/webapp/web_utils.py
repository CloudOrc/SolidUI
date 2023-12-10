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

import os
import pymysql
from dotenv import load_dotenv

load_dotenv(dotenv_path='.env', override=True)

db_host = os.environ.get('DB_HOST')
db_port = int(os.environ.get('DB_PORT'))
db_name = os.environ.get('DB_NAME')
db_user = os.environ.get('DB_USER')
db_pass = os.environ.get('DB_PASS')

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

def query_model_types(page=1, per_page=10):
    conn = pymysql.connect(host=db_host, port=db_port, user=db_user, passwd=db_pass, db=db_name, cursorclass=pymysql.cursors.DictCursor)
    cursor = conn.cursor()

    offset = (page - 1) * per_page

    with conn.cursor() as cursor:
        cursor.execute('select count(1) as total from solidui_model_type')
        total = cursor.fetchone()['total']

        cursor.execute('select * from solidui_model_type limit %s, %s', (offset, per_page))
        items = cursor.fetchall()

    total_pages = (total // per_page) + (1 if total % per_page > 0 else 0)

    cursor.close()
    conn.close()

    result = {
        "items": items,
        "page": page,
        "total": total,
        "total_pages": total_pages
    }

    return result

def create_model_type(params):
    conn = pymysql.connect(host=db_host, port=db_port, user=db_user, passwd=db_pass, db=db_name, cursorclass=pymysql.cursors.DictCursor)
    name = params['name']
    type_name = params['type_name']
    prompt = params['prompt']
    token = params['token']
    base_url = params['base_url']
    code = params['code']

    with conn.cursor() as cursor:
        sql = 'insert into solidui_model_type (name, type_name, prompt, token, baseurl, code) values (%s,%s,%s,%s,%s,%s)'
        cursor.execute(sql, (name, type_name, prompt, token, base_url, code))
        conn.commit()

    cursor.close()
    conn.close()

def delete_model_type(id):
    conn = pymysql.connect(host=db_host, port=db_port, user=db_user, passwd=db_pass, db=db_name, cursorclass=pymysql.cursors.DictCursor)

    with conn.cursor() as cursor:
        sql = 'DELETE FROM solidui_model_type WHERE id = %s'
        cursor.execute(sql, (id))
        conn.commit()

    cursor.close()
    conn.close()

def get_model_type_by_id(id):
    conn = pymysql.connect(host=db_host, port=db_port, user=db_user, passwd=db_pass, db=db_name, cursorclass=pymysql.cursors.DictCursor)

    cursor = conn.cursor()

    cursor.execute("SELECT * FROM solidui_model_type WHERE id = %s", id)

    result = cursor.fetchone()

    cursor.close()
    conn.close()

    return result

def update_model_type(params):
    conn = pymysql.connect(host=db_host, port=db_port, user=db_user, passwd=db_pass, db=db_name, cursorclass=pymysql.cursors.DictCursor)
    id = params['id']
    name = params['name']
    type_name = params['type_name']
    prompt = params['prompt']
    token = params['token']
    base_url = params['base_url']
    code = params['code']

    with conn.cursor() as cursor:
        cursor.execute('select * from solidui_model_type where id = %s', id)
        record = cursor.fetchone()

        if record is None:
            cursor.close()
            conn.close()
            return

        cursor.execute('update solidui_model_type set name = %s, type_name = %s, prompt = %s, token = %s, baseurl = %s, code = %s where id = %s', (name, type_name, prompt, token, base_url, code, id))
        conn.commit()

    cursor.close()
    conn.close()
