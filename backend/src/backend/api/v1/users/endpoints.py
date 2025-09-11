from fastapi import APIRouter

router = APIRouter()

@router.get('/')
async def getUsers():
    return [{"name":"user 1", "id":1}, {"name":"user 1", "id":1}]

@router.get('/{userId}')
async def getUserByid(userId: int):
    return {"name": f"user {userId}", "id":userId}

