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

import gradio as gr
import matplotlib.pyplot as plt
import io
import numpy as np
from PIL import Image
import requests
import json
import re
import base64


def decode_image(img_b64):
    img_data = base64.b64decode(img_b64)
    img = Image.open(io.BytesIO(img_data))
    return img


def get_image_data(fig):
    buf = io.BytesIO()
    fig.savefig(buf, format='png')
    buf.seek(0)
    img = Image.open(buf)
    return img


# Execute Python code and generate images
def execute_code(code):
    namespace = {}
    exec(code, namespace)
    fig = namespace.get('fig')  # Assume the code generates a matplotlib figure named 'fig'
    if fig:
        img = get_image_data(fig)

        img_byte_arr = io.BytesIO()
        img.save(img_byte_arr, format='PNG')
        img_byte_arr = img_byte_arr.getvalue()
        img_b64 = base64.b64encode(img_byte_arr).decode('utf-8')

        return img_b64
    else:
        raise ValueError("The code did not generate a matplotlib figure named 'fig'")


def gpt_inference(base_url, model, openai_key, prompt):
    newprompt = f'Write Python code that does the following: \n\n{prompt}\n\nNote, the code is going to be executed in a Jupyter Python kernel. The code should create a matplotlib figure and assign it to a variable named "fig". The "fig" variable will be used for further processing.\n\nLast instruction, and this is the most important, just return code. No other outputs, as your full response will directly be executed in the kernel.'

    data = {
        "model": model,
        "messages": [
            {
                "role": "user",
                "content": newprompt
            }
        ],
        "temperature": 0.7,
    }

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {openai_key}",
    }

    print(f"openai_key:{openai_key}")
    response = requests.post(f"{base_url}/v1/chat/completions", headers=headers, data=json.dumps(data))
    print("Status code:", response.status_code)
    print("Response JSON:", response.json())
    code = response.json()["choices"][0]["message"]["content"]
    print(f"code:{code}")
    img_b64 = execute_code(code)
    img = decode_image(img_b64)
    return img


iface = gr.Interface(
    fn=gpt_inference,
    inputs=[gr.components.Textbox(), gr.components.Dropdown(choices=["gpt-3.5-turbo", "gpt-4"], label="Model"),
            gr.components.Textbox(), gr.components.Textbox()],
    outputs=gr.Image(),
    title="SolidUI AI-generated visualization platform",
    description="""
    AI-generated visualization prototyping and editing platform, support 2D, 3D models, combined with LLM(Large Language Model) for quick editing.
    GitHub: https://github.com/CloudOrc/SolidUI 
    """,
    labels=["Base URL", "Model", "OpenAI Key", "Prompt"]

)
iface.launch()