# Collaborative Notes API - FastAPI Backend

This is the backend component for the Collaborative Notes Management Application, built with FastAPI.

## Features

* **User Authentication**: Register, Login (JWT-based).
* **Note Management (CRUD)**: Create, Read (single, list), Update, Delete notes.
* **Search & Filtering**: Search notes by title/tags, filter by visibility status.
* **Note Sharing**: Share notes with other users (read-only access), including displaying who shared a note.
* **Public Access**: Allow notes to be accessed via a public URL.
* **Database**: Configurable (SQLite by default, PostgreSQL supported).
* **API Documentation**: Automatic interactive API docs (Swagger UI).

## Technologies Used

* **Framework**: FastAPI
* **ORM/Database**: SQLModel (built on SQLAlchemy), SQLite (default), PostgreSQL (optional)
* **Authentication**: JWT (JSON Web Tokens) with `python-jose` and `passlib`
* **Validation**: Pydantic (integrated with FastAPI and SQLModel)
* **Migrations**: Alembic
* **Dependency Management**: Poetry (recommended) or pip
* **Containerization**: Docker

## Setup and Installation

### Prerequisites

* Python 3.10+
* Poetry (recommended) or pip
* Docker and Docker Compose (for containerized setup)

### Local Development Setup

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/zidanesabir/note_app.git](https://github.com/zidanesabir/note_app.git)
    cd note_app/backend
    ```

2.  **Create and activate a Python virtual environment (if not using Docker):**

    ```bash
    python -m venv venv
    # On Windows:
    .\venv\Scripts\activate
    # On macOS/Linux:
    source venv/bin/activate
    ```

3.  **Install dependencies:**

    * **Using Poetry (Recommended):**
        ```bash
        poetry install
        ```
    * **Using pip:**
        ```bash
        pip install -r requirements.txt
        ```

4.  **Configure Environment Variables:**
    Create a `.env` file in the `backend/` directory by copying `.env.example`:

    ```bash
    copy .env.example .env
    # On macOS/Linux:
    cp .env.example .env.env
    ```
    Edit `.env` to set your `SECRET_KEY` and `DATABASE_URL` (SQLite is default).

5.  **Initialize the Database:**
    The database tables will be created automatically on application startup when `uvicorn` runs. If you modify models, you'll need to use Alembic for migrations (see "Database Migrations" below).

6.  **Run the application:**
    To avoid module import errors, run Uvicorn from the **project root directory** (`your-notes-app/`).

    ```bash
    # First, navigate to the project root (if you're in 'backend/'):
    cd ..

    # Then, activate your virtual environment:
    .\backend\venv\Scripts\activate # On Windows
    # source backend/venv/bin/activate # On macOS/Linux

    # Now, run Uvicorn, specifying the full path to your app:
    uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
    ```
    The API will be available at `http://localhost:8000`.
    Interactive API documentation (Swagger UI) can be accessed at `http://localhost:8000/api/v1/docs`.

### Database Migrations (Alembic)

When you modify your SQLModel models, you'll need to generate and apply database migrations:

1.  **Initialize Alembic (if not already done - usually once per project):**

    ```bash
    # Navigate to the 'backend/' directory for Alembic commands
    cd your-notes-app/backend
    alembic init alembic
    ```

2.  **Ensure `alembic.ini` is configured correctly:**
    In `alembic.ini`, make sure the `sqlalchemy.url` points to your `DATABASE_URL` from `config.py`. You'll typically uncomment and set:
    `sqlalchemy.url = sqlite:///./sql_app.db`
    Also, ensure `script.py.mako` and `env.py` are correctly pointing to your models. (See `env.py` content for the necessary line.)

3.  **Generate a new migration:**

    ```bash
    # Run from the 'backend/' directory
    alembic revision --autogenerate -m "Add description of your changes"
    ```

4.  **Apply the migration:**

    ```bash
    # Run from the 'backend/' directory
    alembic upgrade head
    ```

### Docker Setup

The `Dockerfile` allows you to build a Docker image for the backend. The `docker-compose.yml` (in the project root) will orchestrate the backend, frontend, and database.

1.  **Build the Docker image (from the `backend/` directory):**

    ```bash
    docker build -t collaborative-notes-backend .
    ```
2.  **Run the container (example):**

    ```bash
    docker run -p 8000:8000 collaborative-notes-backend
    ```
    For the full stack, use `docker-compose up` from the root project directory.