from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

from .file_schema import FileResponse
from .user_schema import UserResponse

class MessageBase(BaseModel):
    content: Optional[str] = None

    class Config:
        from_attributes = True

class MessageCreate(MessageBase):
    receiver_id: int
    attachment_ids: Optional[List[int]] = []

class MessageUpdate(BaseModel):
    content: Optional[str] = None

class MessageResponse(MessageBase):
    id: int
    sender_id: int
    receiver_id: int
    is_edited: bool
    created_at: datetime
    updated_at: Optional[datetime]
    sender: UserResponse
    receiver: UserResponse
    attachments: List[FileResponse] = []

    class Config:
        from_attributes = True
