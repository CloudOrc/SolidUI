#!/bin/bash
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

source /etc/profile
source ~/.bash_profile

BIN_DIR=$(dirname $0)
SOLIDUI_HOME=${SOLIDUI_HOME:-$(cd $BIN_DIR/..; pwd)}
SOLIDUI_PID_DIR="${SOLIDUI_HOME}/pid"

if [[ ! -f "$SOLIDUI_PID_DIR/solidui.pid" ]]; then
    echo "solidui is not running!"
    exit 0
fi

kill -15 `cat $SOLIDUI_PID_DIR/solidui.pid`
rm -f $SOLIDUI_PID_DIR/solidui.pid