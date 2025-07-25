from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session, select

from backend.app.db.session import get_session
from backend.app.models.note import Note, SharedNote
from backend.app.models.user import User
from backend.app.schemas.note import NoteCreate, NoteUpdate, NoteResponse, NoteShare
from backend.app.auth.security import get_current_user

router = APIRouter(prefix="/notes", tags=["Notes"])

@router.post("/", response_model=NoteResponse, status_code=status.HTTP_201_CREATED)
def create_note(
    note_create: NoteCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    note = Note.model_validate(note_create, update={"owner_id": current_user.id})
    session.add(note)
    session.commit()
    session.refresh(note)
    return note

@router.get("/", response_model=List[NoteResponse])
def read_my_notes(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by visibility status (private, shared, public)"),
    search_query: Optional[str] = Query(None, alias="q", description="Search by title or tags")
):
    # Base query for notes owned by the current user
    query = select(Note).where(Note.owner_id == current_user.id)

    if status_filter:
        query = query.where(Note.visibility_status == status_filter)

    if search_query:
        query = query.where(
            (Note.title.contains(search_query)) | (Note.tags.contains(search_query))
        )

    notes = session.exec(query).all()
    
    # Also include notes shared WITH the current user (read-only)
    shared_notes_stmt = select(Note).join(SharedNote).where(SharedNote.shared_with_id == current_user.id)
    if status_filter == "shared": # Only include shared notes if explicitly filtered for 'shared'
        notes.extend(session.exec(shared_notes_stmt).all())
    elif status_filter is None: # If no filter, include all notes, including shared ones
         notes.extend(session.exec(shared_notes_stmt).all())

    # Filter out duplicates if a note is owned and shared
    unique_notes = {note.id: note for note in notes}.values()

    return list(unique_notes)

@router.get("/{note_id}", response_model=NoteResponse)
def read_note(
    note_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    note = session.get(Note, note_id)
    if not note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")

    # Check if user is owner or if note is shared with them or if it's public
    if (note.owner_id != current_user.id and
        not session.exec(select(SharedNote).where(SharedNote.note_id == note_id, SharedNote.shared_with_id == current_user.id)).first() and
        note.visibility_status != "public"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to access this note")
    return note

@router.put("/{note_id}", response_model=NoteResponse)
def update_note(
    note_id: int,
    note_update: NoteUpdate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    note = session.get(Note, note_id)
    if not note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
    if note.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this note")

    # Update only provided fields
    update_data = note_update.model_dump(exclude_unset=True)
    note.sqlmodel_update(update_data)
    
    session.add(note)
    session.commit()
    session.refresh(note)
    return note

@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_note(
    note_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    note = session.get(Note, note_id)
    if not note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
    if note.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this note")
    
    # Delete associated shares first to avoid foreign key errors
    session.exec(select(SharedNote).where(SharedNote.note_id == note_id)).all()
    for share in note.shares:
        session.delete(share)
    session.delete(note)
    session.commit()
    return {"message": "Note deleted successfully"}

@router.post("/{note_id}/share", status_code=status.HTTP_200_OK)
def share_note(
    note_id: int,
    note_share: NoteShare,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    note = session.get(Note, note_id)
    if not note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
    if note.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the owner can share a note")
    
    # Check if target user exists
    target_user = session.get(User, note_share.user_id)
    if not target_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Target user not found")
    if target_user.id == current_user.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot share a note with yourself")

    # Check if already shared
    existing_share = session.exec(
        select(SharedNote).where(
            SharedNote.note_id == note_id,
            SharedNote.shared_with_id == note_share.user_id
        )
    ).first()
    if existing_share:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Note already shared with this user")

    shared_note = SharedNote(note_id=note_id, shared_with_id=note_share.user_id)
    session.add(shared_note)
    session.commit()
    session.refresh(shared_note)
    return {"message": f"Note shared with user {target_user.email}"}

# Public access route
@router.get("/public/{note_id}", response_model=NoteResponse)
def get_public_note(note_id: int, session: Session = Depends(get_session)):
    note = session.get(Note, note_id)
    if not note or note.visibility_status != "public":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Public note not found or not accessible publicly")
    return note