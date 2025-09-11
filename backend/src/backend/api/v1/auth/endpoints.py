from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ....database.database import get_db
from ....models.user import User
from ....schemas.user_schema import UserResponse, UserBase
from ....schemas.token_schema import Token
from ....services.auth_service import (
    get_current_user,
    logout_user,
    register_user,
    login_user
)

router = APIRouter()

@router.post("/register", response_model=UserResponse)
async def register(user_data: UserBase, db: Session = Depends(get_db)):
    return register_user(user_data, db)

@router.post("/token", response_model=Token)
async def login(user_data:UserBase, db:Session = Depends(get_db)):
    return login_user(user_data, db)

@router.get("/me", response_model=UserResponse)
async def get_active_user(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/logout")
async def logout(current_user:User = Depends(get_current_user), db: Session = Depends(get_db)):
    return logout_user(current_user, db)