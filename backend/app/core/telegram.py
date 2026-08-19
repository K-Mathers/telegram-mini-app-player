import hashlib
import hmac
from urllib.parse import parse_qsl

def validate_init_data(init_data: str, bot_token: str) -> bool:
    parsed_data = dict(parse_qsl(init_data))
    received_hash = parsed_data.get("hash")

    if not received_hash:
        raise ValueError("Invalid hash")
    
    sorted_keys = sorted([k for k in parsed_data.keys() if k != "hash"])
    data_check_str = "\n".join(f"{k}={parsed_data[k]}" for k in sorted_keys)

    secret_key = hmac.new(
        key=b"WebAppData",
        msg=bot_token.encode(),
        digestmod=hashlib.sha256,
    ).digest()

    calculated_hash = hmac.new(
        key=secret_key,
        msg=data_check_str.encode(),
        digestmod=hashlib.sha256,
    ).hexdigest()

    if not hmac.compare_digest(calculated_hash, received_hash):
        raise ValueError("Invalid signature")
    
    return True