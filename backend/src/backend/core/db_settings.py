from pydantic_settings import BaseSettings

class DBSettings(BaseSettings):
    DATABASE_URL: str
    POSTGRES_DB: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str

    class Config:
        env_file = ".env"
        extra = "allow"

db_settings = DBSettings()