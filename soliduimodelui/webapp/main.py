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
# from langchain.prompts import PromptTemplate
# from langchain.llms import OpenAI
# from langchain.chains import LLMChain

load_dotenv('.env')

APP_PORT = int(os.environ.get("WEB_PORT", 5110))

base_blueprint = Blueprint("baseurl", __name__, url_prefix="/solidui")

# We know this Flask app is for local use. So we can disable the verbose Werkzeug logger
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

cli = sys.modules['flask.cli']
cli.show_server_banner = lambda *x: None

app = Flask(__name__)
CORS(app)

# type 0:gpt-3.5-turbo 1:gpt-4
async def get_code(user_prompt, user_key=None, model="gpt-3.5-turbo", type=0):

    return 0

@base_blueprint.route('/api/<path:path>', methods=["GET", "POST"])
def proxy_kernel_manager(path):
    return web_utils.response_format()

@base_blueprint.route('/generate', methods=['POST'])
def generate_code():
    return web_utils.response_format()

app.register_blueprint(base_blueprint)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=APP_PORT, debug=True, use_reloader=False)
