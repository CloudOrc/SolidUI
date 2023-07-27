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

# The GPT web UI as a template based Flask app
import os
import requests
import json
import asyncio
import re
import logging
import sys

from collections import deque

from flask_cors import CORS
from flask import Flask, request, jsonify, send_from_directory, Response, Blueprint
from dotenv import load_dotenv
import soliduimodelui.webapp.web_utils as web_utils
from soliduimodelui.kernelprogram.main import APP_PORT as KERNEL_APP_PORT


load_dotenv(dotenv_path='soliduimodelui/.env', override=True)

db_host = os.environ.get('DB_HOST')
db_port = int(os.environ.get('DB_PORT'))
db_name = os.environ.get('DB_NAME')
db_user = os.environ.get('DB_USER')
db_pass = os.environ.get('DB_PASS')

APP_PORT = int(os.environ.get("WEB_PORT", 5110))

UPLOAD_FOLDER = 'workspace/'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

base_blueprint = Blueprint("baseurl", __name__, url_prefix="/solidui/models")

# We know this Flask app is for local use. So we can disable the verbose Werkzeug logger
log = logging.getLogger('soliduimodel')
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)
log.addHandler(console_handler)
log.setLevel(logging.INFO)
fh = logging.FileHandler('soliduimodelui/web.log')
log.addHandler(fh)

cli = sys.modules['flask.cli']
cli.show_server_banner = lambda *x: None

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
CORS(app)




class LimitedLengthString:
    def __init__(self, maxlen=2000):
        self.data = deque()
        self.len = 0
        self.maxlen = maxlen

    def append(self, string):
        self.data.append(string)
        self.len += len(string)
        while self.len > self.maxlen:
            popped = self.data.popleft()
            self.len -= len(popped)

    def get_string(self):
        result = ''.join(self.data)
        return result[-self.maxlen:]

message_buffer = LimitedLengthString()

async def get_code_glm(user_prompt, user_key="", model="chatglm", base_url="http://192.168.100.12:8192"):

    prompt = f"首先，这是我之前要求您做的事情的历史记录。实际的提示将在历史结束后呈现。历史:\n\n{message_buffer.get_string()}历史结束。\n\n编写以下Python代码：\n\n{user_prompt}\n\n注意，代码将在Jupyter Python内核中执行。\n\n最后一条指令，这是最重要的，只返回代码。不要输出其他内容，因为您的完整响应将直接在内核中执行。\n\n教师模式：如果您想提供一个下载链接，只需将其打印为 <a href='/solidui/models/download?file=INSERT_FILENAME_HERE'>下载文件</a >。用实际的文件名替换INSERT_FILENAME_HERE。所以只需将该HTML打印到标准输出。无需实际下载文件！"

    # Prepare the payload
    data = {
        "prompt": prompt,
        "history": []
    }

    final_openai_key = user_key

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {final_openai_key}",
    }

    response = requests.post(
        f"{base_url}",
        data=json.dumps(data),
        headers=headers,
    )

    def extract_code(text):
        # Match triple backtick blocks first
        triple_match = re.search(r'```(?:\w+\n)?(.+?)```', text, re.DOTALL)
        if triple_match:
            return triple_match.group(1).strip()
        else:
            # If no triple backtick blocks, match single backtick blocks
            single_match = re.search(r'`(.+?)`', text, re.DOTALL)
            if single_match:
                return single_match.group(1).strip()
        # If no code blocks found, return original text
        return text

    if response.status_code != 200:
        return "Error: " + response.text, 500

    return extract_code(response.json()["response"]), 200

# type 0:gpt-3.5-turbo 1:gpt-4
async def get_code_gpt(user_prompt, user_key="", model="gpt-3.5-turbo", base_url="https://api.openai.com"):
    prompt = f"First, here is a history of what I asked you to do earlier. The actual prompt follows after ENDOFHISTORY. History:\n\n{message_buffer.get_string()}ENDOFHISTORY.\n\nWrite Python code that does the following: \n\n{user_prompt}\n\nNote, the code is going to be executed in a Jupyter Python kernel.\n\nLast instruction, and this is the most important, just return code. No other outputs, as your full response will directly be executed in the kernel. \n\nTeacher mode: if you want to give a download link, just print it as <a href='/solidui/models/download?file=INSERT_FILENAME_HERE'>Download file</a>. Replace INSERT_FILENAME_HERE with the actual filename. So just print that HTML to stdout. No actual downloading of files!"

    data = {
        "model": model,
        "messages": [
            {
                "role": "user",
                "content": prompt,
            },
        ],
        "temperature": 0.7,
    }

    final_openai_key = user_key

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {final_openai_key}",
    }

    response = requests.post(
        f"{base_url}/v1/chat/completions",
        data=json.dumps(data),
        headers=headers,
    )

    def extract_code(text):
        # Match triple backtick blocks first
        triple_match = re.search(r'```(?:\w+\n)?(.+?)```', text, re.DOTALL)
        if triple_match:
            return triple_match.group(1).strip()
        else:
            # If no triple backtick blocks, match single backtick blocks
            single_match = re.search(r'`(.+?)`', text, re.DOTALL)
            if single_match:
                return single_match.group(1).strip()
        # If no code blocks found, return original text
        return text

    if response.status_code != 200:
        return "Error: " + response.text, 500

    return extract_code(response.json()["choices"][0]["message"]["content"]), 200


@base_blueprint.route('/api/<path:path>', methods=["GET", "POST"])
def proxy_kernel_manager(path):
    if request.method == "POST":
        resp = requests.post(
            f'http://localhost:{KERNEL_APP_PORT}/solidui/kernel/{path}', json=request.get_json())
    else:
        resp = requests.get(f'http://localhost:{KERNEL_APP_PORT}/solidui/kernel/{path}')

    excluded_headers = ['content-encoding',
                        'content-length', 'transfer-encoding', 'connection']
    headers = [(name, value) for (name, value) in resp.raw.headers.items()
               if name.lower() not in excluded_headers]

    return web_utils.response_format(code=resp.status_code, data=resp.content.decode('utf-8'))


@base_blueprint.route('/generate', methods=['POST'])
def generate_code():
    user_prompt = request.json.get('prompt', "")
    modelId = request.json.get('modelId', 0)

    log.info(f'Prompt: {user_prompt}, Model Id: {modelId}')

    result = web_utils.query_model(db_host, db_port, db_user, db_pass, db_name , modelId)

    user_key = result['token']
    base_url = result['baseurl']
    model = result['name']
    typeName = result['type_name']
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    if typeName == 'gpt':
        code, status = loop.run_until_complete(
            get_code_gpt(user_prompt, user_key, model, base_url))
        loop.close()
    else:
        code, status = loop.run_until_complete(
            get_code_glm(user_prompt, user_key, model, base_url))
        loop.close()


    # Append all messages to the message buffer for later use
    message_buffer.append(user_prompt + "\n\n")

    return web_utils.response_format(code=status, data={'code': code})


@base_blueprint.route('/download')
def download_file():
    # Get query argument file
    file = request.args.get('file')
    # from `workspace/` send the file
    # make sure to set required headers to make it download the file
    return send_from_directory(os.path.join(os.getcwd(), 'workspace'), file, as_attachment=True)




app.register_blueprint(base_blueprint)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=APP_PORT, debug=True, use_reloader=False)
