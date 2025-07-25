# 📝 Collaborative Notes Management Application

> A modern, full-stack web application for collaborative note-taking with real-time sharing, rich markdown support, and intuitive user experience.

![Notes App Demo](https://img.shields.io/badge/Status-Active-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![Docker](https://img.shields.io/badge/Docker-Supported-blue)

## 🌟 Features

### 🔐 Authentication & Security
- **Secure User System**: JWT-based authentication with bcrypt password hashing
- **Session Management**: Automatic token refresh and secure logout

### 📋 Note Management
- **Rich Text Support**: Full Markdown formatting capabilities
- **Smart Organization**: Tag-based categorization and filtering
- **Flexible Visibility**: Private, shared, or public note access levels
- **Advanced Search**: Find notes instantly by title, content, or tags

### 🤝 Collaboration
- **Real-time Sharing**: Share notes with specific users via email
- **Public Links**: Generate shareable URLs for public access
- **Smart Notifications**: Bell icon shows shared notes count
- **Access Control**: Read-only access for shared notes with clear ownership display

### 🎨 User Experience
- **Responsive Design**: Seamless experience across all devices
- **Modern UI**: Clean interface with glassmorphism effects and smooth animations
- **Interactive Feedback**: SweetAlert2 notifications for all actions
- **Efficient Navigation**: Pagination with 10 notes per page

## 🛠️ Technology Stack

<table>
<tr>
<td width="50%">

### Backend
- **Framework**: FastAPI (Python)
- **Database**: SQLModel + SQLite
- **Authentication**: JWT + Passlib
- **Migrations**: Alembic
- **Package Manager**: Poetry

</td>
<td width="50%">

### Frontend
- **Framework**: Next.js 
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **HTTP Client**: Axios
- **UI Components**: SweetAlert2, Lucide Icons
- **Content**: React Markdown

</td>
</tr>
</table>

## 📁 Project Structure

```
notes-app/
├── 🔧 backend/                 # FastAPI Backend
│   ├── app/                    # Core application logic
│   ├── alembic/               # Database migrations
│   ├── .env.example           # Environment template
│   ├── Dockerfile             # Backend container config
│   └── pyproject.toml         # Python dependencies
├── 🎨 frontend/               # Next.js Frontend
│   ├── src/                   # React components & pages
│   ├── public/                # Static assets
│   ├── .env.local.example     # Frontend environment template
│   ├── Dockerfile             # Frontend container config
│   └── package.json           # Node.js dependencies
├── 🐳 docker-compose.yml      # Multi-service orchestration
└── 📄 README.md               # This file
```

## 🚀 Quick Start

### Prerequisites

- 🐳 **Docker & Docker Compose** (Recommended)
- 🟢 **Node.js 18+** (for local development)
- 🐍 **Python 3.10+** (for local development)
- 📦 **Git**

### 🐳 Docker Setup (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/zidanesabir/note_app.git
   cd note_app
   ```

2. **Configure environment variables**
   ```bash
   # Backend configuration
   cp backend/.env.example backend/.env
   # Edit backend/.env and set a strong SECRET_KEY
   
   # Frontend configuration
   cp frontend/.env.local.example frontend/.env.local
   # Ensure NEXT_PUBLIC_API_BASE_URL=http://backend:8000/api/v1
   ```

3. **Launch the application**
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - 🌐 **Frontend**: http://localhost:3000
   - 📚 **API Docs**: http://localhost:8000/api/v1/docs

### 💻 Local Development

<details>
<summary>🔧 Backend Only</summary>

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or .\venv\Scripts\activate  # Windows

# Install dependencies
poetry install --no-root

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Run from project root
cd ..
uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
```
</details>

<details>
<summary>🎨 Frontend Only</summary>

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.local.example .env.local
# Edit .env.local with backend URL

# Start development server
npm run dev
```
</details>

## 📸 User Interface

The application features a modern, intuitive interface designed for productivity:

### login registre interface
<img width="1226" height="613" alt="image" src="https://github.com/user-attachments/assets/ed452ae7-17d7-47ca-a0f2-74b2c338f47f" />


### Note 
<img width="1275" height="637" alt="image" src="https://github.com/user-attachments/assets/2fd22aa7-b732-469a-b9e9-4ebbecdb5c03" />
<img width="1183" height="640" alt="image" src="https://github.com/user-attachments/assets/5e1be485-5250-4564-9593-326a3acc645a" />
<img width="1194" height="597" alt="image" src="https://github.com/user-attachments/assets/7516d340-8e3c-4fac-86f7-c8d11414609e" />
<img width="1249" height="605" alt="image" src="https://github.com/user-attachments/assets/826e86cf-aa73-4ea8-97eb-a0041cbd4ad5" />


### 📱 Mobile Experience
<img width="308" height="555" alt="image" src="https://github.com/user-attachments/assets/e2beb352-4784-4d85-b56c-fada1cd85a5c" />


## 🎯 Usage Guide

1. **Getting Started**
   - Navigate to http://localhost:3000
   - Create your account with email and password
   - Verify your login credentials

2. **Creating Notes**
   - Click "New Note" to open the editor
   - Add title, content (with Markdown support), and tags
   - Choose visibility: Private, Shared, or Public
   - Save and organize your thoughts

3. **Collaboration**
   - Use the "Share" button to invite users by email
   - Recipients see "Shared by: [email]" on shared notes
   

4. **Organization**
   - Filter notes by status (Private/Shared/Public)
   - Search by title, content, or tags
   - Use pagination to browse large collections

## 🔗 API Documentation

Interactive API documentation is available via Swagger UI:
**http://localhost:8000/api/v1/docs**

Key endpoints:
- `POST /auth/register` - User registration
- `POST /auth/login` - User authentication  
- `GET /notes` - List user notes with filtering
- `POST /notes` - Create new note
- `PUT /notes/{id}` - Update existing note
- `POST /notes/{id}/share` - Share note with user

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### 📋 Development Guidelines
- Follow existing code style and conventions
- Add tests for new features
- Update documentation as needed
- Ensure Docker builds work correctly

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built  using FastAPI and Next.js
- Icons provided by [Lucide React](https://lucide.dev/)
- UI notifications by [SweetAlert2](https://sweetalert2.github.io/)

---

<div align="center">

**[⭐ Star this repo](https://github.com/zidanesabir/note_app)** • **[🐛 Report Bug](https://github.com/zidanesabir/note_app/issues)** • **[💡 Request Feature](https://github.com/zidanesabir/note_app/issues)**

Made with 💻 and ☕ by zidane sabir

</div>
