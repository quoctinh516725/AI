# app/models/user.py

from datetime import datetime
from typing import Optional

from pydantic import BaseModel

class PersonCreate(BaseModel):
    name: str
    age: int
    gender: str
    date_of_birth: str
    image_path: Optional[str] = None
    image_base64: Optional[str] = None
    


class PersonUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    date_of_birth: Optional[datetime] = None