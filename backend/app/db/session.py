from sqlmodel import Session, create_engine, SQLModel
from backend.app.core.config import settings 

engine = create_engine(settings.DATABASE_URL, echo=True, connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {})

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session