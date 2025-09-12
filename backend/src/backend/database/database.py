from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from ..core.db_settings import db_settings

engine = None
SessionLocal = None
Base = declarative_base()

try:
    engine = create_engine(db_settings.DATABASE_URL)
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        print("Database connection successful!")
        print(f"Result: {result.scalar()}")

    SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
except Exception as e:
    print(f"Connection failed: {e}")
    print(f"Database url: {db_settings.DATABASE_URL}")
    raise e

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
