import os
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

import os
from fastapi.staticfiles import StaticFiles
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

if not os.path.exists("uploads"):
    os.makedirs("uploads")
app.mount(f"{settings.API_V1_STR}/uploads", StaticFiles(directory="uploads"), name="uploads")
app.include_router(api_router, prefix=settings.API_V1_STR)

