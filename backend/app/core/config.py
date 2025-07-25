from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # These lines should all have 4 spaces of indentation
    PROJECT_NAME: str = "Collaborative Notes API"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "sabirzidane1234567890" # Make sure this is a strong secret!
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # THIS LINE (DATABASE_URL) MUST BE INDENTED WITH EXACTLY 4 SPACES
    # ALIGN IT PERFECTLY WITH PROJECT_NAME, API_V1_STR, etc.
    DATABASE_URL: str = "sqlite:///./data/sql_app.db" # <-- This line needs 4 spaces before it
    
    # This line should also have 4 spaces of indentation
    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()