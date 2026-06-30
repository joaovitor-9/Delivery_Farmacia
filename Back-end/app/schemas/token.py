from pydantic import BaseModel
from typing import Optional

class Token (BaseModel):
    access_token: str
    token_type:str
    user: Optional[dict] = None

class TokenData(BaseModel):
    email: str | None = None