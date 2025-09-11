from pydantic_settings import BaseSettings
from typing import List

class FilesSettings(BaseSettings):
    UPLOAD_DIR: str ="uploads"
    MAX_FILE_SIZE: int = 10 * 1024 * 1024
    FILES_NUMBER_PER_UPLOAD: int = 5
    ALLOWED_EXTENSIONS: List[str] = {
        'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'doc', 'docx'
    }

    class Config:
        case_sensitive = True

files_settings = FilesSettings()