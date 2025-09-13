from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session

from ....models.user import User
from ....schemas.message_schema import MessageResponse, MessageCreate, MessageUpdate, MessageEventResponse
from ....services.auth_service import get_current_user_ws, get_current_user
from ....services import message_service
from ....database.database import get_db
from ....core.connection_manager import manager

router = APIRouter()

@router.post('/send', response_model=MessageResponse)
async def send_message(message_data:MessageCreate, current_user: User = Depends(get_current_user), db:Session = Depends(get_db)):
    return message_service.send_message(message_data, current_user, db)

@router.websocket('/')
async def websocket_endpoint(websocket:WebSocket, db:Session = Depends(get_db)):
    
    current_user = await get_current_user_ws(websocket, db)
    await manager.connect(websocket, current_user.id)

    try:
        while True:
            data = await websocket.receive_json()
            action = data.get("action")
            if action == "send":
                message_data = MessageCreate(**data["payload"])
                message = message_service.send_message(message_data, current_user, db)
                response = MessageResponse.model_validate(message)
                event_response = MessageEventResponse(event="new_message", data=response)

                await manager.send_to_users([response.sender_id, response.receiver_id], event_response)
            
            elif action == "update":
                message_update = MessageUpdate(**data["payload"])
                message = message_service.update_message(data["message_id"], message_update, current_user, db)
                response = MessageResponse.model_validate(message)
                event_response = MessageEventResponse(event="update_message", data=response)

                await manager.send_to_users([response.sender_id, response.receiver_id], event_response)

            elif action == "delete":
                response = message_service.delete_message(data["message_id"], current_user, db)
                event_response = MessageEventResponse(event="update_message", data=response)
                await manager.send_to_users(
                    [current_user.id, data.get("receiver_id")],
                    {"event": "delete_message", "data": {"id": data["message_id"]}}
                )

    except WebSocketDisconnect:
        manager.disconnect(websocket, current_user.id)