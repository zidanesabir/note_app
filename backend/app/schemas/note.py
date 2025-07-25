from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel

class NoteBase(BaseModel):
    title: str
    content: str
    tags: Optional[str] = None
    visibility_status: str = "private"

class NoteCreate(NoteBase):
    pass

class NoteUpdate(NoteBase):
    title: Optional[str] = None
    content: Optional[str] = None
    tags: Optional[str] = None
    visibility_status: Optional[str] = None

class NoteResponse(NoteBase):
    id: int
    created_at: datetime
    updated_at: datetime
    owner_id: int

    class Config:
        from_attributes = True

class NoteShare(BaseModel):
    user_id: int