from typing import List, Optional
from datetime import datetime
from sqlmodel import Field, Relationship, SQLModel

class SharedNote(SQLModel, table=True):
    # Removed 'id' column as it was redundant and causing the NOT NULL constraint error.
    # The composite primary key is now (note_id, shared_with_id),
    # ensuring a unique share relationship for each note-user pair.
    note_id: int = Field(foreign_key="note.id", primary_key=True)
    shared_with_id: int = Field(foreign_key="user.id", primary_key=True)

    note: Optional["Note"] = Relationship(back_populates="shares")
    shared_with: Optional["User"] = Relationship(back_populates="shared_notes")

class Note(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(index=True)
    content: str
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now, sa_column_kwargs={"onupdate": datetime.now})
    tags: Optional[str] = None
    visibility_status: str = Field(default="private", max_length=10)

    owner_id: Optional[int] = Field(default=None, foreign_key="user.id")
    owner: Optional["User"] = Relationship(back_populates="notes")

    shares: List[SharedNote] = Relationship(back_populates="note")