# CareerLeap


[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org/)
[![Django](https://img.shields.io/badge/Django-4.2-092E20?logo=django)](https://www.djangoproject.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)](https://www.docker.com/)

> A structured career simulation platform that prepares international students and graduates in Germany for professional environments through supervised, role-aligned simulation cohorts.

## 🎯 Overview

CareerLeap bridges the gap between academic education and workplace execution. We help international talent transition from academic preparation to professional execution through controlled, execution-focused simulation cohorts.

**Key Features:**
- 🎓 Cohort-based career simulation programs
- 👨‍🏫 Expert mentorship from industry professionals
- 📁 File and assignment management system
- 📅 Session booking and scheduling
- 🔒 Secure authentication with role-based access
- 🌙 Dark mode support

## 🏗️ Architecture

### Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Vite 7, Tailwind CSS 4, Zustand |
| **Backend** | Django 4.2, Django REST Framework, JWT |
| **Database** | PostgreSQL 16 |
| **Container** | Docker, Docker Compose |
| **Auth** | JWT with refresh tokens, Rate limiting |

### Project Structure

```
careerleap/
├── src/                    # React frontend
│   ├── components/         # Reusable UI components
│   ├── pages/             # Route-level pages
│   ├── store/             # Zustand state stores
│   └── lib/               # API client & utilities
├── backend_django/        # Django backend
│   ├── accounts/          # User authentication
│   ├── mentors/           # Mentor profiles
│   ├── mentorship_sessions/  # Session booking
│   └── files/             # File uploads
├── docker-compose.yml     # Full stack orchestration
└── Dockerfile             # Frontend container
```

## 🚀 Quick Start

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- Make (optional, for convenience commands)

### Option 1: Using Docker (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd careerleap

# Copy environment file
cp .env.docker .env

# Start all services
docker-compose up -d

# Run database migrations
docker-compose exec backend python manage.py migrate

# Create admin user (optional)
docker-compose exec backend python manage.py createsuperuser
```

**Access the application:**
- 🌐 **Web App**: http://localhost:5177
- 🔌 **API**: http://localhost:8000
- 🗄️ **Database UI**: http://localhost:8080 (Adminer)

### Option 2: Using Makefile

```bash
# Quick start with one command
make fresh

# Available commands
make help       # Show all commands
make up         # Start services
make down       # Stop services
make migrate    # Run migrations
make logs       # View logs
```

### Option 3: Manual Setup

See [Manual Setup Guide](#manual-setup) below for non-Docker development.

## 📖 Usage

### For Mentees

1. Register an account at http://localhost:5177/register
2. Complete your profile
3. Browse available mentors
4. Book mentorship sessions
5. Upload assignments and track progress

### For Mentors

1. Register as a mentor
2. Set your availability and hourly rate
3. Manage session requests
4. Review mentee submissions

## 🔧 Configuration

### Environment Variables

Copy `.env.docker` to `.env` and customize:

| Variable | Description | Default |
|----------|-------------|---------|
| `SECRET_KEY` | Django secret key | *(generate for production)* |
| `DEBUG` | Debug mode | `True` |
| `ALLOWED_HOSTS` | Allowed hosts | `localhost,127.0.0.1` |
| `CORS_ALLOWED_ORIGINS` | CORS origins | `http://localhost:5177` |
| `JWT_ACCESS_TOKEN_LIFETIME_MINUTES` | Token expiry | `15` |

### Database Credentials

Default credentials for local development:

- **Database**: careerleap
- **Username**: careerleap_user
- **Password**: careerleap_pass
- **Host**: localhost
- **Port**: 5432

## 🛠️ Development

### Running Tests

```bash
# Backend tests
docker-compose exec backend python manage.py test

# Frontend tests (if configured)
npm test
```

### Code Style

- **JavaScript/React**: ES6+, functional components, async/await
- **Python/Django**: PEP 8, type hints where applicable
- **Git**: Conventional commits

### Database Migrations

```bash
# Create migrations
docker-compose exec backend python manage.py makemigrations

# Apply migrations
docker-compose exec backend python manage.py migrate
```

## 📝 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Register new user |
| POST | `/api/auth/login/` | Login and get JWT |
| GET | `/api/auth/me/` | Get current user |
| POST | `/api/auth/forgot-password/` | Request password reset |

### Mentor Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/mentors/` | List mentors |
| GET | `/api/mentors/<uuid>/` | Get mentor details |
| PUT | `/api/mentors/profile/me/` | Update profile |

### Session Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sessions/my-sessions/` | List my sessions |
| POST | `/api/sessions/create/` | Book new session |
| GET | `/api/sessions/availability/` | Check availability |

### File Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/files/` | List uploads |
| POST | `/api/files/upload/` | Upload file |
| GET | `/api/files/<uuid>/download/` | Download file |

## 🚀 Deployment

### Production Checklist

- [ ] Set `DEBUG=False`
- [ ] Generate strong `SECRET_KEY`
- [ ] Configure `ALLOWED_HOSTS` with your domain
- [ ] Enable HTTPS (`SECURE_SSL_REDIRECT=True`)
- [ ] Set up SMTP for emails
- [ ] Use production PostgreSQL instance
- [ ] Configure CORS for your frontend domain

### Production Deployment

```bash
# Using production compose file
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Write clear, concise commit messages
- Add tests for new features
- Update documentation as needed
- Follow the existing code style

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Troubleshooting

**Port already in use:**
```bash
# Find and kill the process
lsof -ti:5177 | xargs kill -9
lsof -ti:8000 | xargs kill -9
```

**Database connection issues:**
```bash
# Reset database (WARNING: loses all data)
docker-compose down -v
docker-compose up -d
```

**Container won't start:**
```bash
# Rebuild from scratch
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Getting Help

- Check the [Security Guide](SECURITY.md) for security-related questions
- Review existing [Issues](../../issues) for common problems
- Create a new issue with detailed information

---

## Manual Setup

For development without Docker:

### 1. Database (Docker)

```bash
cd backend_django
docker-compose up -d db
```

### 2. Backend

```bash
cd backend_django

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Edit .env with your settings

# Run migrations
python manage.py migrate

# Start server
python manage.py runserver 8000
```

### 3. Frontend

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

---

<p align="center">
  Built with ❤️ for international talent in Germany
</p>
