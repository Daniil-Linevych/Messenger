from sqlalchemy import Column, Integer, ForeignKey, Table
from ..database.database import Base

message_attachments = Table(
    'message_attachments',
    Base.metadata,
    Column('message_id', Integer, ForeignKey('messages.id'), primary_key=True),
    Column('file_id', Integer, ForeignKey('files.id'), primary_key=True)
)
