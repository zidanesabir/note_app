from typing import List, Optional
from datetime import datetime
from sqlmodel import Field, Relationship, SQLModel

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str

    notes: List["Note"] = Relationship(back_populates="owner")
    shared_notes: List["SharedNote"] = Relationship(back_populates="shared_with")