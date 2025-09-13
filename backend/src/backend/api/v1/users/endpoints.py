from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.orm import Session

from ....schemas.user_schema import UserResponse
from ....database.database import get_db
from ....services.auth_service import get_current_user
from ....models.user import User
from ....services import users_service

router = APIRouter()

@router.get('/', response_model=List[UserResponse])
async def get_users(_:User = Depends(get_current_user), db:Session = Depends(get_db)):
    return users_service.get_users(db)

@router.get('/{username}', response_model=List[UserResponse])
async def getUserByid(username: str, _:User = Depends(get_current_user), db:Session = Depends(get_db)):
    return users_service.get_user_by_username(username, db)

