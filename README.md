# CareerLeap

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org/)
[![Django](https://img.shields.io/badge/Django-4.2-092E20?logo=django)](https://www.djangoproject.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)](https://www.docker.com/)

> A structured career simulation platform that prepares international students and graduates in Germany for professional environments through supervised, role-aligned simulation cohorts.

## 🎯 Overview

CareerLeap bridges the gap between academic education and workplace execution. We help international talent transition from academic preparation to professional execution through controlled, execution-focused simulation cohorts.

**Key Features:**
- 🎓 Cohort-based career simulation programs with live and upcoming tracks
- 👨‍🏫 Expert mentorship from industry professionals
- 📅 Session booking and scheduling with availability management
- 📁 File and assignment management system
- 📝 Customer journey lead form with scoring and classification
- 📊 Privacy-first analytics and metrics tracking
- 🍪 GDPR cookie consent management
- 🔒 Secure authentication with JWT and role-based access
- 🌙 Light/dark/system theme support

## 🏗️ Architecture

### Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Vite 7, Tailwind CSS 4, Zustand, Framer Motion |
| **Backend** | Django 4.2, Django REST Framework, JWT (simplejwt) |
| **Database** | PostgreSQL 16 |
| **Container** | Docker, Docker Compose |
| **Auth** | JWT with rotating refresh tokens, rate limiting |
| **Email** | SMTP via Resend |
| **Deployment** | Render Blueprint, Docker Compose (prod) |

### Project Structure

```
careerleap/
├── src/                          # React frontend
│   ├── components/               # Reusable UI components
│   ├── pages/                    # Route-level pages
│   │   └── tracks/               # Career track detail pages
│   ├── store/                    # Zustand state stores
│   ├── lib/                      # API client, metrics, utilities
│   ├── App.jsx                   # Router and navigation
│   └── main.jsx                  # Entry point
├── backend_django/               # Django backend
│   ├── accounts/                 # User authentication
│   ├── mentors/                  # Mentor profiles
│   ├── mentorship_sessions/      # Session booking
│   ├── files/                    # File uploads
│   ├── leads/                    # Customer journey lead capture
│   ├── metrics/                  # Analytics events
│   ├── backend_django/           # Project settings & middleware
│   └── requirements.txt
├── nginx/                        # Production nginx config
├── docker-compose.yml            # Development orchestration
├── docker-compose.prod.yml       # Production orchestration
├── Dockerfile                    # Frontend container
├── backend_django/Dockerfile     # Backend container
├── render.yaml                   # Render Blueprint
└── README.md                     # This file
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

### For Prospective Participants

1. Browse career tracks on the homepage or `/career-tracks`
2. Click **"Apply for the Next Cohort"** or **"View Track Details"**
3. Complete the customer journey form at `/contact`
4. Book a free info session via the Calendly-linked button

### For Mentees

1. Register an account at `/login`
2. Complete your profile at `/profile`
3. Browse available mentors at `/mentors`
4. Book mentorship sessions
5. Upload assignments and track progress at `/files`

### For Mentors

1. Register as a mentor
2. Set your availability and hourly rate at `/profile`
3. Manage session requests at `/my-sessions`
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
| `DATABASE_URL` | PostgreSQL connection URL | — |
| `JWT_ACCESS_TOKEN_LIFETIME_MINUTES` | Access token expiry | `15` |
| `JWT_REFRESH_TOKEN_LIFETIME_DAYS` | Refresh token expiry | `7` |
| `EMAIL_BACKEND` | Django email backend | `console` (dev) |
| `EMAIL_HOST` | SMTP host | `smtp.resend.com` |
| `EMAIL_PORT` | SMTP port | `587` |
| `EMAIL_HOST_USER` | SMTP username | `resend` |
| `EMAIL_HOST_PASSWORD` | SMTP/API password | — |
| `DEFAULT_FROM_EMAIL` | Default sender | `info@career-leap.academy` |
| `FRONTEND_URL` | Frontend URL for password reset links | `http://localhost:5177` |
| `AWS_ACCESS_KEY_ID` | Optional S3 access key | — |
| `AWS_SECRET_ACCESS_KEY` | Optional S3 secret key | — |
| `AWS_STORAGE_BUCKET_NAME` | Optional S3 bucket | — |

### Frontend Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | API base URL | `/api` |
| `VITE_CALENDLY_URL` | Calendly booking link for info sessions | — |

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

# Frontend build check
npm run build
```

### Code Style

- **JavaScript/React**: ES6+, functional components, async/await
- **Python/Django**: PEP 8, type hints where applicable
- **Git**: Conventional commits
- See `CODING_STANDARDS.md` for detailed contribution guidelines (internal doc)

### Database Migrations

```bash
# Create migrations
docker-compose exec backend python manage.py makemigrations

# Apply migrations
docker-compose exec backend python manage.py migrate
```

## 📝 API Documentation

### Authentication Endpoints (`/api/auth/`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register/` | Register new user |
| POST | `/login/` | Login and get JWT |
| GET | `/me/` | Get current user |
| PUT/PATCH | `/profile/update/` | Update current user profile |
| POST | `/refresh/` | Refresh access token |
| POST | `/forgot-password/` | Request password reset |
| POST | `/reset-password/` | Reset password with token |
| POST | `/validate-reset-token/` | Validate password reset token |
| POST | `/contact/` | Submit contact form |

### Mentor Endpoints (`/api/mentors/`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List mentors with filters/pagination |
| GET | `/filters/` | Get available filter options |
| GET | `/<uuid>/` | Get mentor details |
| PUT | `/profile/me/` | Update mentor profile |

### Session Endpoints (`/api/sessions/`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List all sessions (admin) |
| GET | `/my-sessions/` | List user's sessions |
| GET | `/availability/` | Check mentor availability |
| POST | `/create/` | Book new session |
| GET | `/<uuid>/` | Get session details |
| PUT | `/<uuid>/update/` | Update session |
| DELETE | `/<uuid>/cancel/` | Cancel session |

### File Endpoints (`/api/files/`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List uploads |
| POST | `/upload/` | Upload file |
| GET | `/categories/` | Get file categories |
| GET | `/stats/` | Get upload statistics |
| GET | `/<uuid>/` | Get file details |
| DELETE | `/<uuid>/delete/` | Delete file |
| GET | `/<uuid>/download/` | Download file |

### Lead Endpoints (`/api/leads/`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/journey/` | Submit customer journey form |

### Metrics Endpoints (`/api/metrics/`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/track/` | Track analytics event |

## 🚀 Deployment

### Production Checklist

- [ ] Set `DEBUG=False`
- [ ] Generate strong `SECRET_KEY`
- [ ] Configure `ALLOWED_HOSTS` with your domain
- [ ] Enable HTTPS (`SECURE_SSL_REDIRECT=True`)
- [ ] Set up SMTP credentials for Resend
- [ ] Use production PostgreSQL instance
- [ ] Configure CORS for your frontend domain
- [ ] Set `VITE_CALENDLY_URL` for info session booking
- [ ] Configure S3 or persistent storage for media files
- [ ] Set secure cookie flags (`SESSION_COOKIE_SECURE=True`, `CSRF_COOKIE_SECURE=True`)

### Render Deployment

The project includes a `render.yaml` Blueprint. On Render:

1. Connect the GitHub repository
2. Render creates the backend web service and static frontend site
3. Set all required environment variables in the Render dashboard
4. Deploy automatically on pushes to `main`

### Docker Production Deployment

```bash
# Using production compose file
docker-compose -f docker-compose.prod.yml up -d
```

Production compose includes:
- PostgreSQL database
- Django backend with Gunicorn
- nginx reverse proxy serving static/media and proxying API requests

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Write clear, concise commit messages following conventional commits
- Add backend tests for new features
- Update documentation as needed
- Follow the existing code style
- Update `AGENTS.md` if you change architecture or workflows

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
