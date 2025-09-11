import os
import uuid
import aiofiles
from sqlalchemy.orm import Session
from fastapi import UploadFile
from fastapi.responses import FileResponse
from typing import List

from ..core.files_settings import files_settings
from ..schemas.message_schema import MessageCreate, MessageUpdate
from ..models import User, Message, File
from ..exceptions.file_exceptions import ExceededUploadFilesLimit, ExceededUploadFileSize, InvalidFileName, InvalidFileExtension, FileNotFound, FileNotFoundOnDisk
from ..exceptions.message_exceptions import WrongOwnerError

def get_file_extension(filename: str) -> str:
    return filename.rsplit('.', 1)[1].lower() if '.' in filename else ''

def is_allowed_file(filename: str) -> bool:
    return get_file_extension(filename) in files_settings.ALLOWED_EXTENSIONS

def generate_unique_filename(filename) -> str:
    file_extension = get_file_extension(filename)
    return f"{uuid.uuid4()}.{file_extension}"

def generate_file_path(filename)-> str:
    return os.path.join(files_settings.UPLOAD_DIR, filename)

async def write_file_content(file_path:str, content:bytes):
    async with aiofiles.open(file_path, 'wb') as f:
        await f.write(content)

async def upload_files(files: List[UploadFile], current_user: User, db: Session):

    if len(files) > files_settings.FILES_NUMBER_PER_UPLOAD:
        raise ExceededUploadFilesLimit
    
    uploaded_files = []
    
    for file in files:
        if not file.filename:
            raise InvalidFileName
        
        if not is_allowed_file(file.filename):
            raise InvalidFileExtension
        
        content = await file.read()
        if len(content) > files_settings.MAX_FILE_SIZE:
            raise ExceededUploadFileSize
        
        unique_filename = generate_unique_filename(file.filename)
        file_path = generate_file_path(unique_filename)
        
        await write_file_content(file_path, content)
        
        db_file = File(
            file_name=unique_filename,
            original_file_name=file.filename,
            file_path=file_path,
            file_size=len(content),
            mime_type=file.content_type or 'application/octet-stream',
            uploaded_by=current_user.id
        )
        db.add(db_file)
        db.flush()
        
        uploaded_files.append(db_file)
    
    db.commit()
    return uploaded_files

def download_file(file_id:int, db:Session):
    file_record = db.query(File).filter(File.id == file_id).first()
    if not file_record:
        raise FileNotFound
    
    if not os.path.exists(file_record.file_path):
        raise FileNotFoundOnDisk
    
    return FileResponse(
        path=file_record.file_path,
        filename=file_record.original_file_name,
        media_type=file_record.mime_type
    )

def get_user_files(current_user:User, db:Session):
    files = db.query(File).filter(File.uploaded_by == current_user.id).all()
    return files

def delete_file(file_id:int, current_user:User, db:Session):

    file_record = db.query(File).filter(File.id == file_id).first()
    if not file_record:
        raise FileNotFound
    
    if file_record.uploaded_by != current_user.id:
        raise WrongOwnerError
    
    if os.path.exists(file_record.file_path):
        os.remove(file_record.file_path)
    
    db.delete(file_record)
    db.commit()
    
    return {"message": "File deleted successfully"}