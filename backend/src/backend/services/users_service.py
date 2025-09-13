from sqlalchemy.orm import Session
from typing import List

from ..models import User, Message
from ..schemas.message_schema import MessageResponse
from ..schemas.conversation_schema import Conversation
from ..exceptions.message_exceptions import UserNotFound

def get_users(db: Session, limit:int = 10)->List[User]:
    users = db.query(User).limit(limit).all()
    return users

def get_user_by_username(username:str, db: Session)->User:
    users = db.query(User).filter(User.username.ilike(f"%{username}%")).all()
    return users