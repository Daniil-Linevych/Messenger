from sqlalchemy.orm import Session

from ..schemas.message_schema import MessageCreate, MessageUpdate
from ..models import User, Message, File
from ..exceptions.message_exceptions import ReceiverNotFound, SelfReceiverError, AttachmentsrError, MessageNotFound, WrongOwnerError

def validate_attachments(attachment_ids, user_id:int, db:Session):
    attachments = db.query(File).filter(
            File.id.in_(attachment_ids),
            File.uploaded_by == user_id
        ).all()
        
    if len(attachments) != len(attachment_ids):
            raise AttachmentsrError
    
    return attachments

def send_user_message(message_data:MessageCreate, current_user:User, db:Session):
    receiver = db.query(User).filter(User.id == message_data.receiver_id).first()
    if not receiver:
        raise ReceiverNotFound
    
    if message_data.receiver_id == current_user.id:
        raise SelfReceiverError
    
    message = Message(
        content = message_data.content,
        sender_id = current_user.id,
        receiver_id = message_data.receiver_id
    )

    db.add(message)
    db.flush()

    if message_data.attachment_ids:
        message.attachments = validate_attachments(message_data.attachment_ids, current_user.id, db)

    db.commit()
    db.refresh(message)

    return message

def update_message(message_id:int, message_update: MessageUpdate, current_user: User, db: Session):
    message = db.query(Message).filter(Message.id == message_id).first()
    if not message:
        raise MessageNotFound
    
    if message.sender_id != current_user.id:
        raise WrongOwnerError
    
    if message_update.content is not None:
        message.content = message_update.content
        message.is_edited = True
    
    db.commit()
    db.refresh(message)

    return message

def delete_message(message_id:int, current_user:User, db:Session):
    message = db.query(Message).filter(Message.id == message_id).first()
    if not message:
        raise MessageNotFound
    
    if message.sender_id != current_user.id:
        raise WrongOwnerError
    
    db.delete(message)
    db.commit()
    return {"message": "Message deleted successfully"}