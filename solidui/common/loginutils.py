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
import time
from typing import Dict

from constants import SESSION_TIMEOUT, SESSION_TICKETID_KEY, TICKETHEADER
from utils import decrypt, encrypt

user_ticket_id_to_last_access_time: Dict[str, float] = {}


def clean_expired_sessions():
    current_time = time.time()
    expired_keys = [
        user_ticket_id
        for user_ticket_id, last_access_time in user_ticket_id_to_last_access_time.items()
        if current_time - last_access_time > SESSION_TIMEOUT
    ]
    for expired_key in expired_keys:
        print(f"Removing expired session for user {expired_key}")
        del user_ticket_id_to_last_access_time[expired_key]


def get_user_ticket_id(username: str) -> str:
    timeout_user = f"{username},{time.time()}"
    return encrypt(f"{TICKETHEADER}{timeout_user}")


def set_login_user(username: str) -> Dict[str, str]:
    if username:
        user_ticket_id = get_user_ticket_id(username)
        if user_ticket_id:
            user_ticket_id_to_last_access_time[user_ticket_id] = time.time()
            return {SESSION_TICKETID_KEY: user_ticket_id}
    return {}


def remove_login_user(cookies: Dict[str, str]):
    user_ticket_id = cookies.get(SESSION_TICKETID_KEY)
    if user_ticket_id:
        del user_ticket_id_to_last_access_time[user_ticket_id]
        cookies[SESSION_TICKETID_KEY] = None


def get_login_user(cookies: Dict[str, str]) -> str:
    user_ticket_id = cookies.get(SESSION_TICKETID_KEY)
    if user_ticket_id:
        try:
            decrypted = decrypt(user_ticket_id)
            if decrypted.startswith(TICKETHEADER):
                return decrypted[len(TICKETHEADER):decrypted.rindex(',')]
        except:
            pass
    return 'admin'




