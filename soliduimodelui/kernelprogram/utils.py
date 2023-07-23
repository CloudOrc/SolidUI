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

import re
import json
import snakemq.link
import snakemq.packeter
import snakemq.messaging
import snakemq.message

import soliduimodelui.kernelprogram.config as config

def escape_ansi(line):
    ansi_escape = re.compile(r"(?:\x1B[@-_]|[\x80-\x9F])[0-?]*[ -/]*[@-~]")
    return ansi_escape.sub("", line)


def send_json(messaging, message, identity):
    message = snakemq.message.Message(json.dumps(message).encode("utf-8"), ttl=600)
    messaging.send_message(identity, message)

def init_snakemq(ident, init_type="listen"):
    link = snakemq.link.Link()
    packeter = snakemq.packeter.Packeter(link)
    messaging = snakemq.messaging.Messaging(ident, "", packeter)
    if init_type == "listen":
        link.add_listener(("0.0.0.0", config.SNAKEMQ_PORT))
    elif init_type == "connect":
        link.add_connector(("localhost", config.SNAKEMQ_PORT))
    else:
        raise Exception("Unsupported init type.")
    return messaging, link

