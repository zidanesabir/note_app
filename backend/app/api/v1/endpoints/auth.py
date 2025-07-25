# backend/app/api/v1/endpoints/auth.py
from fastapi import APIRouter, Depends, HTTPException, status, Query # Added Query
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
from typing import List, Optional # Added List, Optional for the new endpoint

from backend.app.db.session import get_session
from backend.app.models.user import User
from backend.app.schemas.user import UserCreate, UserResponse
from backend.app.schemas.token import Token
from backend.app.auth.security import verify_password, get_password_hash, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse)
def register_user(user_create: UserCreate, session: Session = Depends(get_session)):
    existing_user = session.exec(select(User).where(User.email == user_create.email)).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    hashed_password = get_password_hash(user_create.password)
    user = User(email=user_create.email, hashed_password=hashed_password)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

@router.post("/login", response_model=Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)
):
    user = session.exec(select(User).where(User.email == form_data.username)).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"user_id": user.id})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

# --- THIS IS THE CRUCIAL ENDPOINT THAT NEEDS TO BE PRESENT ---
@router.get("/users", response_model=List[UserResponse])
def get_users_by_email(
    email: str = Query(..., description="Email of the user to search for"),
    session: Session = Depends(get_session)
):
    """
    Retrieves a list of users matching the provided email.
    Since email is unique, it will return at most one user in the list.
    """
    users = session.exec(select(User).where(User.email == email)).all()

    # Optional: If you want to return 404 if no user is found
    # if not users:
    #     raise HTTPException(
    #         status_code=status.HTTP_404_NOT_FOUND,
    #         detail=f"User with email '{email}' not found"
    #     )

    return users