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

import json
import re
import requests

from solidui.views.base_schemas import LimitedLengthString

default_prompt_message_buffer = LimitedLengthString()
code_prompt_message_buffer = LimitedLengthString()
html_prompt_message_buffer = LimitedLengthString()


def extract_code(text):
    triple_match = re.search(r'```(?:\w+\n)?(.+?)```', text, re.DOTALL)
    if triple_match:
        return triple_match.group(1).strip()
    single_match = re.search(r'`(.+?)`', text, re.DOTALL)
    if single_match:
        return single_match.group(1).strip()
    return text


async def send_request_and_process_response(url, headers, data, process_response_func):
    response = requests.post(url, data=json.dumps(data), headers=headers)
    if response.status_code != 200:
        return "Error: " + response.text, 500
    return process_response_func(response), 200


async def get_code(gpt_prompt, user_prompt, model_code, user_key="", model_type="gpt", base_url="default_url",
                   model: str = None, process_response_func=None):
    new_prompt = prompt_type_buffer(gpt_prompt, user_prompt, model_code)

    if model_type == "glm":
        # URL、headers和data
        url, headers, data = configure_for_glm(base_url, model, user_key, new_prompt)
    elif model_type == "gpt":
        url, headers, data = configure_for_gpt(base_url, model, user_key, new_prompt)
    else:
        raise ValueError("Unsupported model type")

    return await send_request_and_process_response(url, headers, data, process_response_func or extract_code)


def add_prompt_type_buffer(user_prompt, model_code):
    if model_code == 'python':
        code_prompt_message_buffer.append(user_prompt + "\n\n")
    elif model_code == 'html':
        html_prompt_message_buffer.append(user_prompt + "\n\n")
    else:
        default_prompt_message_buffer.append(user_prompt + "\n\n")


def prompt_type_buffer(gpt_prompt, user_prompt, model_code):
    if model_code == 'python':
        prompt = gpt_prompt.format(code_prompt_message_buffer.get_string(), user_prompt)
    elif model_code == 'html':
        prompt = gpt_prompt.format(html_prompt_message_buffer.get_string(), user_prompt)
    else:
        prompt = gpt_prompt.format(default_prompt_message_buffer.get_string(), user_prompt)

    return prompt


def configure_for_glm(base_url, model, user_key, prompt):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {user_key}",
    }

    data = {
        "prompt": prompt,
        "history": []
    }

    url = f"{base_url}"

    return url, headers, data


def configure_for_gpt(base_url, model, user_key, prompt):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {user_key}",
    }

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

    url = f"{base_url}/v1/chat/completions"

    return url, headers, data
