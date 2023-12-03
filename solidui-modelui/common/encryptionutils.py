import hashlib


def get_md5(raw_str: str) -> str:
    if raw_str is None:
        raw_str = ""

    digest = hashlib.md5(raw_str.encode('utf-8')).hexdigest()
    return digest