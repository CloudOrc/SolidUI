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

import logging
import threading
import time
from flask import request, make_response

from solidui.common.constants import SESSION_TIMEOUT, TICKETHEADER, CRYPTKEY, SESSION_TICKETID_KEY, ADMIN_NAME
from solidui.utils.des_utils import DESUtil

logger = logging.getLogger(__name__)

user_ticket_id_to_last_access_time = {}


def schedule_timeout_removal():
    def remove_timeout_user_tickets():
        try:
            current_time = time.time() * 1000  # Convert to milliseconds
            for key, value in list(user_ticket_id_to_last_access_time.items()):
                if current_time - value > SESSION_TIMEOUT:
                    logger.info(f"remove timeout userTicket {key}, since the last access time is {value}.")
                    user_ticket_id_to_last_access_time.pop(key, None)
        except Exception as e:
            logger.error("Failed to remove timeout user ticket id.", exc_info=True)


    thread = threading.Timer(SESSION_TIMEOUT / 1000 / 10, remove_timeout_user_tickets)
    thread.daemon = True
    thread.start()

schedule_timeout_removal()


def get_user_ticket_id(username: str):
    timeout_user = f"{username},{int(time.time() * 1000)}"
    try:
        return DESUtil.encrypt(f"{TICKETHEADER}{timeout_user}", CRYPTKEY)
    except Exception as e:
        logger.info(f"Failed to encrypt user ticket id, username: {username}")
        return None


def set_login_user(username: str):
    if username:
        user_ticket_id = get_user_ticket_id(username)
        if user_ticket_id:
            user_ticket_id_to_last_access_time[user_ticket_id] = int(time.time() * 1000)
            resp = make_response()
            resp.set_cookie(key=SESSION_TICKETID_KEY, value=user_ticket_id, max_age=43200, path='/')
            return resp
    return None


def remove_login_user(cookies):
    resp = make_response("Cookie cleared")
    for cookie in cookies:
        if cookie == SESSION_TICKETID_KEY:

            user_ticket_id = request.cookies.get(cookie)
            if user_ticket_id:
                user_ticket_id_to_last_access_time.pop(user_ticket_id, None)

            resp.set_cookie(SESSION_TICKETID_KEY, '', max_age=0)
    return resp


def get_login_user(cookies):
    for cookie_name, cookie_value in cookies.items():
        if cookie_name == SESSION_TICKETID_KEY:
            user_ticket_id = cookie_value
            try:
                timeout_user = DESUtil.decrypt(user_ticket_id, CRYPTKEY)
                if timeout_user and timeout_user.startswith(TICKETHEADER):
                    return timeout_user.split(',')[0][len(TICKETHEADER):]
            except Exception as e:
                logger.info(f"Failed to decrypt user ticket id, userTicketId: {user_ticket_id}")
    return ADMIN_NAME
