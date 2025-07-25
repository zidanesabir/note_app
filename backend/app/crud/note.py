from backend.app.models.note import Note, NoteCreate, NoteUpdate
from backend.app.crud.base import CRUDBase

class CRUDNote(CRUDBase[Note, NoteCreate, NoteUpdate]):
    pass

note = CRUDNote(Note)