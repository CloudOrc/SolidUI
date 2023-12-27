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

from typing import List, Generic, TypeVar

T = TypeVar('T')


class PageInfo(Generic[T]):
    def __init__(self, current_page: int = 1, page_size: int = 20):
        self.current_page = max(current_page, 1)
        self.page_size = max(page_size, 1)
        self.total = 0
        self.total_list: List[T] = []
        self.total_page = 0

    def set_total(self, total: int):
        self.total = total
        self.total_page = (total + self.page_size - 1) // self.page_size

    def set_total_list(self, total_list: List[T]):
        self.total_list = total_list
