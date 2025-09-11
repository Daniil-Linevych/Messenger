from pydantic_settings import BaseSettings

class DBSettings(BaseSettings):
    DATABASE_URL: str

    class Config:
        env_file = ".env"
        extra = "allow"

db_settings = DBSettings()