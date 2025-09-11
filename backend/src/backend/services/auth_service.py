from typing import Optional
from datetime import timedelta, datetime
from fastapi import Depends

from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import jwt, JWTError

from ..database.database import get_db
from ..models.user import User
from ..core.auth_settings import auth_settings
from ..schemas.token_schema import Token, TokenData
from ..schemas.user_schema import UserBase
from ..exceptions.auth_exceptions import InvalidCredentials, UsernameAlreadyExists

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def verify_password(plain_password, hashed_password)->bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password)->str:
    return pwd_context.hash(password)

def get_user_by_username(db: Session, username: str)->User:
    return db.query(User).filter(User.username == username).first()

def authenticate_user(db: Session, username:str, password:str)->User:
    user = get_user_by_username(db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp":expire})
    encoded_jwt = jwt.encode(to_encode, auth_settings.SECRET_KEY, algorithm=auth_settings.ALGORITHM)
    return encoded_jwt

def verify_access_token(token: str)->TokenData:
    try:
        payload = jwt.decode(token, auth_settings.SECRET_KEY, algorithms=[auth_settings.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise InvalidCredentials
        return TokenData(username=username)
    except JWTError:
        raise InvalidCredentials

def register_user(user_data:UserBase, db: Session)->User:
    user = get_user_by_username(db, username=user_data.username)
    if user:
        raise UsernameAlreadyExists
    
    hashed_password = get_password_hash(user_data.password)
    user = User(
        username=user_data.username,
        hashed_password=hashed_password
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user

def login_user(user_data:UserBase, db:Session)->Token:
    user = authenticate_user(db, user_data.username, user_data.password)
    if not user:
        raise InvalidCredentials
    
    access_token_expires = timedelta(minutes=auth_settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )

    user.is_online = True
    db.commit()

    return {"access_token":access_token, "token_type":"bearer"}

def logout_user(user:User, db: Session)->str:
    user.is_online = False
    db.commit()

    return {"message":"Successfully logged out!"}

async def get_current_user(token: str = Depends(oauth2_scheme), db:Session = Depends(get_db))->User:
    token_data = verify_access_token(token)

    user = get_user_by_username(db, token_data.username)
    if user is None:
        raise InvalidCredentials()
    return user 


    