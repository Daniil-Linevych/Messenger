from fastapi import HTTPException, status
from ..core.files_settings import files_settings

class InvalidFileName(HTTPException):

    def __init__(self):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must have a name"
        )

class InvalidFileExtension(HTTPException):

    def __init__(self):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type not allowed. Allowed types: {', '.join(files_settings.ALLOWED_EXTENSIONS)}"
        )

class ExceededUploadFilesLimit(HTTPException):

    def __init__(self):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot upload more than {files_settings.FILES_NUMBER_PER_UPLOAD} files at once"
        )

class ExceededUploadFileSize(HTTPException):

    def __init__(self):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File too large. Maximum size: {files_settings.MAX_FILE_SIZE // (1024*1024)}MB"
        )

class FileNotFound(HTTPException):

    def __init__(self):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found"
        )

class FileNotFoundOnDisk(HTTPException):

    def __init__(self):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found on disk"
        )
    

