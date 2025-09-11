from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.orm import Session

from ....database.database import get_db
from ....models import User
from ....schemas.conversation_schema import Conversation
from ....schemas.message_schema import MessageResponse
from ....services import conversation_service
from ....services.auth_service import get_current_user

router = APIRouter()

@router.get('/', response_model=List[Conversation])
def get_conversations(current_user:User = Depends(get_current_user), db:Session = Depends(get_db)):
    return conversation_service.get_conversations(current_user, db)

@router.get('/{user_id}', response_model=List[MessageResponse])
def get_conversation_messages(user_id, current_user:User = Depends(get_current_user), db:Session = Depends(get_db)):
    return conversation_service.get_conversation_messages(user_id, current_user, db)