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

from setuptools import setup, find_packages
from os import path

this_directory = path.abspath(path.dirname(__file__))
with open(path.join(this_directory, 'README.md'), encoding='utf-8') as f:
    long_description = f.read()

setup(
    name='solidui',
    version='0.5.0',
    description="AI-generated visualization prototyping and editing platform",
    long_description=long_description,
    long_description_content_type='text/markdown',  # This field specifies the format of the `long_description`.
    packages=find_packages(),
    install_requires=[
        'click>=8.0.3',
        'click-option-group',
        'colorama',
        'deprecation>=2.1.0, <2.2.0',
        'flask>=2.2.5, <3.0.0',
        'flask-appbuilder>=4.3.9, <5.0.0',
        'flask-session>=0.4.0, <1.0',
        'ipykernel>=6,<7',
        'python-dotenv>=1,<2',
        'pycryptodome',
        'matplotlib>=3,<4',
        'pandas>=1,<2',
        'snakemq>=1,<2',
        'requests>=2,<3',
        'sqlalchemy>=1.4, <2',
        'sqlalchemy-utils>=0.38.3, <0.39',
        'typing-extensions>=4, <5',
        'werkzeug>=2.3.3, <3',
        "wtforms>=2.3.3, <4",
        "wtforms-json"
    ],
    extras_require={
        "cors": ["flask-cors>=2.0.0"],
        "mysql": ["mysqlclient>=2.1.0, <3"]
    },
    entry_points={
        'console_scripts': [
            'solidui=solidui.cli.main:solidui',
        ],
    },
    python_requires="~=3.9",
    url="https://cloudorc.github.io/SolidUI-Website/",
)
