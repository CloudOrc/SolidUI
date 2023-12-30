#!/bin/sh
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

# Include common script
. "$(dirname "$0")/common.sh"

nohup $JAVA_HOME/bin/java $JAVA_OPTS \
  -cp "$SOLIDUI_HOME/conf":"$SOLIDUI_HOME/libs/*" \
  com.cloudorc.solidui.entrance.EntranceApplicationServer 2>&1 > $SOLIDUI_LOG_DIR/${SERVER_NAME}.out &

pid=$!
sleep 2
if [[ -z "${pid}" ]]; then
    echo "server $SERVER_NAME start failed!"
    exit 1
else
    echo "server $SERVER_NAME start succeeded!"
    echo $pid > $SOLIDUI_PID_DIR/solidui.pid
fi