from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, desc
from typing import List

from ..models import User, Message
from ..schemas.message_schema import MessageResponse
from ..schemas.conversation_schema import Conversation
from ..exceptions.message_exceptions import UserNotFound

def get_conversations(current_user:User, db: Session)->List[Conversation]:
    sent_messages = db.query(Message.receiver_id).filter(
        Message.sender_id == current_user.id
    )

    received_messages = db.query(Message.sender_id).filter(
        Message.receiver_id == current_user.id
    )

    all_conversations = sent_messages.union(received_messages)

    conversations_query = db.query(User).filter(
        User.id != current_user.id,
        User.id.in_(all_conversations)
    )

    conversations = []
    for user in conversations_query.all():
        last_message = db.query(Message).filter(
            or_(
                and_(Message.sender_id == current_user.id, Message.receiver_id == user.id),
                and_(Message.sender_id == user.id, Message.receiver_id == current_user.id)
            )
        ).order_by(desc(Message.created_at)).first()
        
        
        conversations.append({
            "user": user,
            "last_message": last_message,
        })
    
    conversations.sort(
        key=lambda x: x["last_message"].created_at if x["last_message"] else x["user"].created_at,
        reverse=True
    )
    
    return conversations

def get_conversation_messages(user_id:int, current_user: User, db: Session)->List[MessageResponse]:
    other_user = db.query(User).filter(User.id == user_id).first()
    if not other_user:
        raise UserNotFound
    
    messages = db.query(Message).filter(
        or_(
            and_(Message.sender_id == current_user.id, Message.receiver_id == user_id),
            and_(Message.sender_id == user_id, Message.receiver_id == current_user.id)
        )
    ).order_by(desc(Message.created_at)).all()
    
    db.commit()
    
    return messages[::-1]