from typing import Optional
from pydantic import BaseModel, Field
from datetime import datetime

class UserBase(BaseModel):
    username:str = Field(..., min_length=3, max_length=50, example="fasty")
    password:str = Field(..., min_length=6, example="securepass")

class UserResponse(BaseModel):
    id:int
    username:str
    is_online: bool
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True
