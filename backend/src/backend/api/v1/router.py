from fastapi import APIRouter
from .users.endpoints import router as users_router
from .auth.endpoints import router as auth_router
from .messages.endpoints import router as messages_router
from .conversations.endpoints import router as conversations_router
from .files.endpoints import router as files_router

api_router = APIRouter()

api_router.include_router(users_router, prefix='/users')
api_router.include_router(auth_router)
api_router.include_router(messages_router, prefix='/messages')
api_router.include_router(conversations_router, prefix='/conversations')
api_router.include_router(files_router, prefix='/files')

@api_router.get("/healthcheck")
def is_api_healthy():
    return {"state":"healthy"}