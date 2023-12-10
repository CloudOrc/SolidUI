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

from .constants import *
from .connect_dto import ConnectDTO

class BaseJdbcClientFactory(ABC):

    def get_connect_dto(self, conn_params):
        connect_dto = ConnectDTO()
        connect_dto.host = conn_params.get(PARAM_SQL_HOST)
        connect_dto.port = conn_params.get(PARAM_SQL_PORT)
        connect_dto.username = conn_params.get(PARAM_SQL_USERNAME)
        connect_dto.password = conn_params.get(PARAM_SQL_PASSWORD)
        connect_dto.database = conn_params.get(PARAM_SQL_DATABASE)
        extra_params = conn_params.get(PARAM_SQL_EXTRA_PARAMS)
        if extra_params is None:
            connect_dto.extra_params = {}
        else:
            connect_dto.extra_params = extra_params
        return connect_dto

    @abstractmethod
    def create_jdbc_client(self, connect_dto):
        pass