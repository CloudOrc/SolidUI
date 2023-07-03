def response_format(code=0,msg="success",data={},success=True,failed=False):
    return {
        "code": code,
        "msg": msg,
        "data": data,
        "success": success,
        "failed": failed
    }