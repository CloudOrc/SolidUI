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


from dataclasses import dataclass
from typing import List, Optional
from datetime import datetime


@dataclass
class JobElementPage:
    project_id: int
    page: Page
    size: Size
    views: List[View]


@dataclass
class Page:
    name: str
    id: int


@dataclass
class Size:
    width: str
    height: str


@dataclass
class View:
    id: Optional[int] = None
    title: str
    position: Position
    size: Size
    type: str
    options: dict
    data: Data


@dataclass
class Position:
    top: str
    left: str


@dataclass
class Data:
    source_id: Optional[int] = None
    source_name: Optional[str] = None
    source_type_id: Optional[int] = None
    source_type_name: Optional[str] = None
    sql: Optional[str] = None
    table: Optional[str] = None





@dataclass
class DataSourceVO:
    id: Optional[int] = None
    name: Optional[str] = None
    description: Optional[str] = None
    type_id: Optional[int] = None
    type: Optional[str] = None
    create_identify: Optional[str] = None
    params: Optional[str] = None
    create_time: Optional[datetime] = None
    create_user: Optional[str] = None
    labels: Optional[str] = None
    expired: bool = False


@dataclass
class ModelCommandVO:
    type: str
    value: str


@dataclass
class ModelKeyVO:
    id: int
    name: str
    type_name: str