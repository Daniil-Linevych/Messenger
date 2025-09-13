from fastapi import WebSocket
from typing import Dict, List
from pydantic import BaseModel
from ..schemas.message_schema import MessageEventResponse

class ConnectionManager:

    def __init__(self):
        self.active_connections: Dict[int, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, user_id):
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(websocket)

    def disconnect(self, websocket: WebSocket, user_id):
        if user_id in self.active_connections:
            self.active_connections[user_id].remove(websocket)
        if not self.active_connections[user_id]:
            del self.active_connections[user_id]

    async def send_to_user(self, user_id:int, message:MessageEventResponse):
        if user_id in self.active_connections:
            for connection in self.active_connections[user_id]:

                if isinstance(message, BaseModel):
                    message_dict = message.model_dump(mode='json') 
                else:
                    message_dict = message
                await connection.send_json(message_dict)

    async def send_to_users(self, user_ids: List[int], message: MessageEventResponse):
        for uid in user_ids:
            await self.send_to_user(uid, message)

manager = ConnectionManager()

    