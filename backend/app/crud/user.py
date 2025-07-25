from backend.app.models.user import User, UserCreate
from backend.app.schemas.user import UserResponse # UserResponse might not be strictly needed for CRUD base
from backend.app.crud.base import CRUDBase

class CRUDUser(CRUDBase[User, UserCreate, UserResponse]):
    pass

user = CRUDUser(User)