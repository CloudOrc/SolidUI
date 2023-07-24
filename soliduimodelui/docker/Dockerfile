# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
FROM python:3.8-slim

ENV TZ Asia/Shanghai
ENV SOLIDUI_HOME /opt/solidui

WORKDIR $SOLIDUI_HOME

RUN mkdir -p $SOLIDUI_HOME/workspace && \
    mkdir -p $SOLIDUI_HOME/soliduimodelui

COPY ./README.md $SOLIDUI_HOME/

COPY ./setup.py $SOLIDUI_HOME/

COPY ./soliduimodelui/__init__.py $SOLIDUI_HOME/soliduimodelui/

COPY ./soliduimodelui/.env $SOLIDUI_HOME/soliduimodelui/

COPY ./soliduimodelui/main.py $SOLIDUI_HOME/soliduimodelui/

COPY ./soliduimodelui/webapp $SOLIDUI_HOME/soliduimodelui/webapp

COPY ./soliduimodelui/kernelprogram $SOLIDUI_HOME/soliduimodelui/kernelprogram

RUN pip install -e .

CMD ["modelui"]
