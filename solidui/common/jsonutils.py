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
import json
from datetime import datetime
from typing import Any, Dict, List, Optional, Union

import pytz

YYYY_MM_DD_HH_MM_SS = "yyyy-MM-dd HH:mm:ss"

class JSONUtils:

    @staticmethod
    def to_json(obj: Any) -> str:
        return json.dumps(obj)

    @staticmethod
    def to_pretty_json(obj: Any) -> str:
        return json.dumps(obj, indent=4)

    @staticmethod
    def parse(text: str) -> Any:
        return json.loads(text)

    @staticmethod
    def parse_to_dict(text: str) -> Dict:
        return json.loads(text)

    @staticmethod
    def parse_to_list(text: str) -> List:
        return json.loads(text)

    @staticmethod
    def serialize_to_bytes(obj: Any) -> bytes:
        return json.dumps(obj).encode('utf-8')

    @staticmethod
    def deserialize(bytes_data: bytes, clazz: Any) -> Any:
        return json.loads(bytes_data, object_hook=lambda d: clazz(**d))

    @staticmethod
    def get_field(data: Dict, field: str) -> Any:
        return data.get(field)

    @staticmethod
    def to_map(text: str) -> Dict[str, Any]:
        return json.loads(text)

    @staticmethod
    def find_value(data: Dict, key: str) -> Optional[str]:
        return data.get(key)

    @staticmethod
    def serialize_datetime(dt: datetime) -> str:
        return dt.strftime(YYYY_MM_DD_HH_MM_SS)

    @staticmethod
    def deserialize_datetime(text: str) -> datetime:
        return datetime.strptime(text, YYYY_MM_DD_HH_MM_SS).replace(tzinfo=pytz.utc)



