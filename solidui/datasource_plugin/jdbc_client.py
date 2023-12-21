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
from abc import ABC, abstractmethod

class JdbcClient(ABC):

    @abstractmethod
    def generate_select_all_data_sql(self, database, table_name):
        pass

    @abstractmethod
    def get_all_databases(self):
        pass

    @abstractmethod
    def get_all_tables(self, database):
        pass

    @abstractmethod
    def get_select_result(self, sql):
        pass

    @abstractmethod
    def close(self):
        pass

    @abstractmethod
    def get_conn(self):
        pass
