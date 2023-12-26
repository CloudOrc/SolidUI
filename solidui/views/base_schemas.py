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
from typing import Optional, Dict, List


@dataclass
class Position:
    top: str = None
    left: str = None


@dataclass
class Size:
    width: str = None
    height: str = None


@dataclass
class Data:
    dataSourceId: int = None
    dataSourceName: str = None
    dataSourceTypeId: int = None
    dataSourceTypeName: str = None
    sql: str = None
    table: str = None


@dataclass
class View:
    id: int = None
    title: str = None
    position: Position = None
    size: Size = None
    type: str = None
    options: Dict[str, object] = None
    data: Data = None


@dataclass
class DataView:
    position: Position = None
    size: Size = None
    options: Dict[str, object] = None
    data: Data = None


@dataclass
class JobElementDTO:
    id: int = None
    projectId: int = None
    name: str = None
    dataType: str = None
    createTime: str = None
    updateTime: str = None
    dataView: DataView = None


@dataclass
class Page:
    name: str = None
    id: int = None


@dataclass
class JobElementPageVO:
    projectId: int = None
    page: Page = None
    size: Size = None
    views: List[View] = None


