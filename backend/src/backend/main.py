import os
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from .core.settings import settings
from .core.files_settings import files_settings
from .api.v1.router import api_router 

os.makedirs(files_settings.UPLOAD_DIR, exist_ok=True)

app = FastAPI(title=settings.PROJECT_NAME, version=settings.VERSION, debug=settings.DEBUG_MODE)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(api_router, prefix=settings.API_V1_STR)

