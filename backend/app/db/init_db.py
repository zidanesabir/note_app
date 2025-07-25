# This file is for initial database population, e.g., creating a default admin user.
# You can uncomment and adapt this if you need initial data.
# from sqlmodel import Session, select
# from backend.app.db.session import engine
# from backend.app.models.user import User
# from backend.app.auth.security import get_password_hash

# def init_db(session: Session):
#     user = session.exec(select(User).where(User.email == "admin@example.com")).first()
#     if not user:
#         hashed_password = get_password_hash("adminpassword")
#         user_in = User(email="admin@example.com", hashed_password=hashed_password)
#         session.add(user_in)
#         session.commit()
#         session.refresh(user_in)
#         print("Superuser created!")