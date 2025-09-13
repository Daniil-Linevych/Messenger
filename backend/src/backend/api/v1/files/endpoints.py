from fastapi import APIRouter, Depends, UploadFile, File as FastAPIFile
from sqlalchemy.orm import Session
from typing import List

from ....schemas.file_schema import FileResponse
from ....database.database import get_db
from ....models import User, File
from ....services.auth_service import get_current_user
from ....services import files_service

router = APIRouter()

@router.post('/', response_model=List[FileResponse])
async def upload_files(files: List[UploadFile] = FastAPIFile(...), current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return await files_service.upload_files(files, current_user, db)

@router.get("/{file_id}", response_model=FileResponse)
async def download_file(file_id: int, _: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return files_service.download_file(file_id, db)    

@router.get("/", response_model=List[FileResponse])
async def get_user_files(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return files_service.get_user_files(current_user, db)

@router.delete("/{file_id}")
async def delete_file(file_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return files_service.delete_file(file_id, current_user, db)