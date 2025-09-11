from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ....schemas.message_schema import MessageResponse, MessageCreate, MessageUpdate
from ....models import User
from ....services.auth_service import get_current_user
from ....services import message_service
from ....database.database import get_db

router = APIRouter()

@router.post('/', response_model=MessageResponse)
async def send_message(message_data:MessageCreate, current_user: User = Depends(get_current_user), db:Session = Depends(get_db)):
    return message_service.send_user_message(message_data, current_user, db)

@router.put("/{message_id}", response_model=MessageResponse)
async def update_message(message_id: int, message_update: MessageUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return message_service.update_message(message_id, message_update, current_user, db)
   
@router.delete("/{message_id}")
async def delete_message(message_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return message_service.delete_message(message_id, current_user, db)
