from pydantic import BaseModel
from datetime import datetime
from typing import Optional

from .message_schema import MessageResponse

class ConversationUser(BaseModel):
    id: int
    username: str
    is_online: bool

    class Config:
        from_attributes = True

class Conversation(BaseModel):
    user: ConversationUser
    last_message: Optional[MessageResponse]