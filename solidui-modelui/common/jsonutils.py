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


