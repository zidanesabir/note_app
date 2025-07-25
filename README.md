# Collaborative Notes Management Application

This is a full-stack web application designed for collaborative note management, featuring user authentication, note creation, sharing, search, filtering, and a modern, responsive user interface.

## Table of Contents

* [Features](#features)
* [Technologies Used](#technologies-used)
* [Project Structure](#project-structure)
* [Setup and Installation](#setup-and-installation)
    * [Prerequisites](#prerequisites)
    * [Local Development with Docker Compose (Recommended)](#local-development-with-docker-compose-recommended)
    * [Local Development (Backend Only)](#local-development-backend-only)
    * [Local Development (Frontend Only)](#local-development-frontend-only)
* [Usage](#usage)
* [API Documentation](#api-documentation)
* [Contributing](#contributing)
* [License](#license)

## Features

* **User Authentication**: Secure registration, login, and logout using JWT (JSON Web Tokens).
* **Notes Management**: Create, view, edit, and delete personal notes.
* **Rich Content**: Notes content supports Markdown formatting.
* **Tags & Visibility**: Organize notes with optional tags and set visibility (private, shared, public).
* **Search & Filter**: Easily find notes by title, tags, or visibility status.
* **Collaborative Sharing**: Share notes with other registered users (read-only access).
    * Shared notes display the "Shared by:" email of the original owner for clarity.
* **Public Access Links**: Generate public URLs for selected notes, allowing access without login.
* **Responsive UI**: Modern, intuitive, and mobile-friendly design adapting to various screen sizes.
* **Interactive Feedback**: Polished user experience with SweetAlert2 notifications and subtle animations for smooth transitions.
* **Pagination**: Browse notes efficiently with paginated lists (displaying 10 notes per page).
* **Notifications**: A bell icon in the header indicates the count of notes shared with the logged-in user, which can be clicked to view the list of shared notes.

## Technologies Used

### Backend (FastAPI)

* **Framework**: FastAPI
* **Database**: SQLModel (ORM), SQLite (default for local Docker development), PostgreSQL (recommended for production/scalable Docker setups).
* **Authentication**: JWT (JSON Web Tokens) with `python-jose` and `passlib` (Bcrypt for password hashing).
* **Validation**: Pydantic (integrated with FastAPI for data validation and serialization).
* **Migrations**: Alembic (for database schema evolution).
* **Dependency Management**: Poetry (recommended for reproducible builds) or pip.

### Frontend (Next.js)

* **Framework**: Next.js (built on React).
* **Styling**: Tailwind CSS (for utility-first styling).
* **State Management**: React Context API (for global authentication state).
* **HTTP Client**: Axios (for API interactions).
* **Alerts/Notifications**: SweetAlert2 (for customizable alerts and confirmations).
* **Icons**: Lucide React (for scalable vector icons).
* **Markdown Renderer**: React Markdown (for displaying Markdown content).

## Project Structure

You've successfully built a fully functional and beautifully designed application! Now, let's make your README.md even more professional by organizing it and adding a dedicated section for screenshots of your graphical interface.

Here's the updated README.md for your project's root directory (your-notes-app/README.md).

README.md (Finalized Main Project README with Screenshots Section)
Markdown

# Collaborative Notes Management Application

This is a full-stack web application designed for collaborative note management, featuring user authentication, note creation, sharing, search, filtering, and a modern, responsive user interface.

## Table of Contents

* [Features](#features)
* [Technologies Used](#technologies-used)
* [Project Structure](#project-structure)
* [Setup and Installation](#setup-and-installation)
    * [Prerequisites](#prerequisites)
    * [Local Development with Docker Compose (Recommended)](#local-development-with-docker-compose-recommended)
    * [Local Development (Backend Only)](#local-development-backend-only)
    * [Local Development (Frontend Only)](#local-development-frontend-only)
* [User Interface (Screenshots)](#user-interface-screenshots) # <--- NEW SECTION IN TOC
* [Usage](#usage)
* [API Documentation](#api-documentation)
* [Contributing](#contributing)
* [License](#license)

## Features

* **User Authentication**: Secure registration, login, and logout using JWT (JSON Web Tokens).
* **Notes Management**: Create, view, edit, and delete personal notes.
* **Rich Content**: Notes content supports Markdown formatting.
* **Tags & Visibility**: Organize notes with optional tags and set visibility (private, shared, public).
* **Search & Filter**: Easily find notes by title, tags, or visibility status.
* **Collaborative Sharing**: Share notes with other registered users (read-only access).
    * Shared notes display the "Shared by:" email of the original owner for clarity.
* **Public Access Links**: Generate public URLs for selected notes, allowing access without login.
* **Responsive UI**: Modern, intuitive, and mobile-friendly design adapting to various screen sizes.
* **Interactive Feedback**: Polished user experience with SweetAlert2 notifications and subtle animations for smooth transitions.
* **Pagination**: Browse notes efficiently with paginated lists (displaying 10 notes per page).
* **Enhanced UI/UX**: Streamlined design with subtle glassmorphism, gradients, and engaging animations.
* **Notifications**: A bell icon in the header indicates the count of notes shared with the logged-in user, which can be clicked to view the list of shared notes.

## Technologies Used

### Backend (FastAPI)

* **Framework**: FastAPI
* **Database**: SQLModel (ORM), SQLite (default for local Docker development), PostgreSQL (recommended for production/scalable Docker setups).
* **Authentication**: JWT (JSON Web Tokens) with `python-jose` and `passlib` (Bcrypt for password hashing).
* **Validation**: Pydantic (integrated with FastAPI for data validation and serialization).
* **Migrations**: Alembic (for database schema evolution).
* **Dependency Management**: Poetry (recommended for reproducible builds) or pip.

### Frontend (Next.js)

* **Framework**: Next.js (built on React).
* **Styling**: Tailwind CSS (for utility-first styling).
* **State Management**: React Context API (for global authentication state).
* **HTTP Client**: Axios (for API interactions).
* **Alerts/Notifications**: SweetAlert2 (for customizable alerts and confirmations).
* **Icons**: Lucide React (for scalable vector icons).
* **Markdown Renderer**: React Markdown (for displaying Markdown content).

## Project Structure

notes-app/
├── backend/                        # FastAPI Backend Application
│   ├── app/                        # Main FastAPI source code (routers, models, schemas, auth, db)
│   ├── alembic/                    # Database migration scripts and configuration
│   ├── .env.example                # Example environment variables for backend
│   ├── Dockerfile                  # Dockerfile for building the backend service image
│   ├── pyproject.toml              # Poetry configuration for Python dependencies
│   └── README.md                   # Backend specific documentation
├── frontend/                       # Next.js Frontend Application
│   ├── public/                     # Static assets (e.g., favicon)
│   ├── src/                        # React components, pages, context, hooks, styles, API client
│   ├── .env.local.example          # Example environment variables for frontend
│   ├── Dockerfile                  # Dockerfile for building the frontend service image
│   ├── package.json                # npm/Yarn dependencies and scripts
│   ├── tailwind.config.js          # Tailwind CSS configuration
│   └── README.md                   # Frontend specific documentation
├── .gitignore                      # Global Git ignore rules for the entire project
└── docker-compose.yml              # Docker Compose configuration for orchestrating services
└── LICENSE                         # Project license (e.g., MIT)
##interfaces
<img width="1322" height="631" alt="image" src="https://github.com/user-attachments/assets/411faf24-a07a-4f01-a615-ec715a337190" />
<img width="1277" height="643" alt="image" src="https://github.com/user-attachments/assets/4da79c62-58ca-4bb0-a4eb-5bb4f52d45e2" />
<img width="1276" height="638" alt="image" src="https://github.com/user-attachments/assets/81f27193-d39f-4dcc-9fc8-f0034b26d546" />
<img width="1231" height="617" alt="image" src="https://github.com/user-attachments/assets/f7e53163-b942-4848-8da9-aad43375aa22" />
<img width="1299" height="578" alt="image" src="https://github.com/user-attachments/assets/ceee37ca-5ce7-42a9-a494-434f45a407ac" />
<img width="1261" height="629" alt="image" src="https://github.com/user-attachments/assets/e349e5cd-302c-4589-a59b-5fbe0f98759b" />
<img width="1274" height="629" alt="image" src="https://github.com/user-attachments/assets/85a63365-a516-4ec0-8fe0-e191a5890764" />






## Setup and Installation

### Prerequisites

Before you begin, ensure you have the following installed on your system:

* **Git**: For cloning the repository.
* **Node.js & npm (or Yarn)**: For frontend development (v18+ LTS recommended).
* **Python 3.10+**: For backend development.
* **Docker & Docker Compose**: (Highly Recommended) For easy setup and running of the entire application stack.

### Local Development with Docker Compose (Recommended)

This is the easiest and most consistent way to get the entire application running locally.

1.  **Clone the repository:**

    ```bash
   git clone https://github.com/zidanesabir/note_app.git
    cd note_app
    ```

2.  **Create `.env` files:**
    * **For Backend** (in `your-notes-app/backend/.env`): Copy the example file.

        ```bash
        cp backend/.env.example backend/.env
        ```
        Open `backend/.env` and **replace `YOUR_DOCKER_SECRET_KEY` with a strong, random string** (e.g., generated with `python -c "import secrets; print(secrets.token_urlsafe(32))"`). The `DATABASE_URL` is set directly in `docker-compose.yml` for Dockerized usage.

    * **For Frontend** (in `your-notes-app/frontend/.env.local`): Copy the example file.

        ```bash
        cp frontend/.env.local.example frontend/.env.local
        ```
        Ensure `NEXT_PUBLIC_API_BASE_URL` is set to `http://backend:8000/api/v1`, which is the internal Docker network address for your backend service.

3.  **Build and run the Docker containers:**
    This command will build the Docker images for both backend and frontend (if necessary), set up the network, and start all services.

    ```bash
    docker-compose up --build
    ```
    * This process will download base images, install Python and Node.js dependencies, and build your application. It might take several minutes the first time.
    * The frontend will be accessible at `http://localhost:3000`.
    * The backend API (Swagger UI) will be at `http://localhost:8000/api/v1/docs`.

    **To stop the services:**

    ```bash
    docker-compose down
    ```
    To stop and remove all associated data (containers, networks, and volumes, including the SQLite database file), use:
    ```bash
    docker-compose down -v
    ```

### Local Development (Backend Only)

Follow these steps if you want to run the FastAPI backend directly on your machine (without Docker).

1.  **Navigate to the backend directory:**

    ```bash
    cd your-notes-app/backend
    ```

2.  **Create and activate a Python virtual environment:**

    ```bash
    python -m venv venv
    # On Windows:
    .\venv\Scripts\activate
    # On macOS/Linux:
    source venv/bin/activate
    ```

3.  **Install Python dependencies:**
    This project uses Poetry for dependency management.

    ```bash
    # First, ensure Poetry is installed if you don't have it globally:
    # pip install poetry

    # Then, run poetry install to generate poetry.lock and install dependencies:
    poetry install --no-root
    # If using pip and requirements.txt instead, use:
    # pip install -r requirements.txt
    ```

4.  **Configure `.env`:**
    ```bash
    cp .env.example .env
    # Edit .env to set your SECRET_KEY and DATABASE_URL (e.g., sqlite:///./sql_app.db in the backend folder)
    ```

5.  **Run the application (from the project root):**
    To avoid module import errors, run Uvicorn from the **project root directory** (`your-notes-app/`).

    ```bash
    # If you are in 'backend/', navigate up:
    cd ..

    # Activate your virtual environment:
    .\backend\venv\Scripts\activate # On Windows
    # source backend/venv/bin/activate # On macOS/Linux

    # Run Uvicorn:
    uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
    ```
    The API will be available at `http://localhost:8000`. Swagger UI at `http://localhost:8000/api/v1/docs`.

### Local Development (Frontend Only)

Follow these steps if you want to run the Next.js frontend directly on your machine (without Docker). Ensure your backend is running separately (either locally or via Docker).

1.  **Navigate to the frontend directory:**

    ```bash
    cd your-notes-app/frontend
    ```

2.  **Install Node.js dependencies:**

    ```bash
    npm install
    # or yarn install
    ```

3.  **Configure `.env.local`:**

    ```bash
    cp .env.local.example .env.local
    # Ensure NEXT_PUBLIC_API_BASE_URL points to your running backend (e.g., http://localhost:8000/api/v1)
    ```

4.  **Run the development server:**

    ```bash
    npm run dev
    # or yarn dev
    ```
    The frontend will be available at `http://localhost:3000`.

## Usage

1.  Access the application at `http://localhost:3000`.
2.  **Register** a new user account.
3.  **Login** using your new credentials.
4.  Explore the "My Notes" dashboard:
    * **Create** new notes with titles, content (Markdown), tags, and visibility settings.
    * **View** note details.
    * **Edit** and **Delete** your own notes.
    * **Search** notes by title or tags.
    * **Filter** notes by status (private, shared, public).
    * Use **pagination** to navigate through notes.
5.  **Test Sharing:**
    * Create a second user account.
    * Log in as the first user, create a note, and use the "Share" button to share it with the second user's email.
    * Log in as the second user. You should see the shared note in your list, with a "Shared by:" message. Only the "View" option will be available for shared notes.
    * Observe the notification bell in the header! Click it to see a list of notes shared with you.

## API Documentation

The FastAPI backend automatically generates interactive API documentation (Swagger UI). Once the backend is running, access it at:
`http://localhost:8000/api/v1/docs`

## Contributing

Feel free to fork the repository, open issues, and submit pull requests.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
