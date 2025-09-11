from pydantic import BaseModel
from datetime import datetime

class FileResponse(BaseModel):
    id: int
    file_name: str
    mime_type: str
    uploaded_at: datetime

    class Config:
        from_attributes = True