from fastapi import APIRouter

from backend.app.api.v1.endpoints import auth, notes

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(notes.router)