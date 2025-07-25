# Collaborative Notes App - Next.js Frontend

This is the frontend component for the Collaborative Notes Management Application, built with Next.js and styled with Tailwind CSS.

## Features

* **User Authentication**: Login and Registration forms with Lucide icons.
* **Notes Dashboard**: Displays notes in a modern table with search, filter, and pagination.
    * Notes can be owned or shared.
    * "Shared by" email is displayed for shared notes on detail page and in table.
* **Note Editor**: Create and modify notes with Markdown support.
* **Note Sharing**: Share notes with other registered users (read-only access).
* **Public Access**: Allow notes to be accessed via a public URL.
* **Responsive Design**: Optimized for desktop and mobile.
* **Enhanced User Feedback**: Integrated SweetAlert2 for polished notifications and confirmations.
* **Modern UI/UX**: Streamlined design with subtle glassmorphism, gradients, and engaging animations.
* **Notification System**: Bell icon in header shows count of shared notes; click to view details.

## Technologies Used

* **Framework**: Next.js
* **Styling**: Tailwind CSS
* **State Management**: React Context API (for Auth)
* **HTTP Client**: Axios
* **Routing**: Next.js Router
* **Alerts/Notifications**: SweetAlert2
* **Icons**: Lucide React
* **Markdown Rendering**: React Markdown

## Setup and Installation

### Prerequisites

* Node.js (LTS version recommended, e.g., v20)
* npm (comes with Node.js) or Yarn
* Your FastAPI Backend (running on `http://localhost:8000`)

### Local Development Setup

1.  **Navigate to the frontend directory:**

    ```bash
    cd your-notes-app/frontend
    ```

2.  **Install dependencies:**
    This command will install all packages listed in `package.json`, including `react-markdown` and `sweetalert2`.

    ```bash
    npm install
    # or if you use yarn
    # yarn install
    ```

3.  **Configure Environment Variables:**
    Create a `.env.local` file in the `frontend/` directory by copying `.env.local.example`. This file tells your frontend where to find the backend API.

    ```bash
    copy .env.local.example .env.local
    # On macOS/Linux:
    cp .env.local.example .env.local
    ```
    Ensure the `NEXT_PUBLIC_API_BASE_URL` matches your FastAPI backend's URL. The default is usually correct for local development:
    `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1`

4.  **Run the development server:**
    This will start the Next.js development server.

    ```bash
    npm run dev
    # or
    # yarn dev
    ```
    The frontend application will be available in your web browser at `http://localhost:3000`.

### Docker Setup

The `Dockerfile` in this directory allows you to build a Docker image specifically for the frontend. For a full stack setup, you'll typically use the `docker-compose.yml` file located in the project's root directory, which orchestrates both backend and frontend.

1.  **Build the Docker image (from the `frontend/` directory):**

    ```bash
    docker build -t collaborative-notes-frontend .
    ```
2.  **Run the container (example, for testing frontend in isolation if backend is also running in a container or on host):**

    ```bash
    docker run -p 3000:3000 -e NEXT_PUBLIC_API_BASE_URL=[http://host.docker.internal:8000/api/v1](http://host.docker.internal:8000/api/v1) collaborative-notes-frontend
    # Note: `host.docker.internal` is a special DNS name that resolves to the host machine's IP address from within a Docker container.
    # This is essential if your backend is running directly on your host machine.
    ```
    For the full stack orchestrated by Docker Compose, use `docker-compose up --build` from the **root project directory** (`your-notes-app/`).

---