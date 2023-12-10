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
import threading
from concurrent.futures import ThreadPoolExecutor

def thread_factory(thread_name: str, is_daemon: bool):
    thread_id = 0

    def create_thread(func):
        nonlocal thread_id
        thread_id += 1
        thread_name = f'{thread_name}{thread_id}'
        thread = threading.Thread(target=func, name=thread_name)
        thread.setDaemon(is_daemon)
        return thread

    return create_thread

def default_scheduler():
    executor = ThreadPoolExecutor(
        max_workers=20,
        thread_name_prefix='SolidUI-Default-Scheduler-Thread-',
        thread_factory=thread_factory
    )
    executor.set_keep_alive(5, 60)
    return executor