# CareerLeap Django Backend

This is the Django backend for CareerLeap, replacing the previous Node.js/Express backend.

## Features

- **Authentication**: JWT-based authentication with access and refresh tokens
- **User Management**: Custom User model with roles (mentee, mentor, admin)
- **Mentor Profiles**: Separate mentor profile with expertise, hourly rate, ratings
- **Sessions**: Booking system for mentorship sessions
- **CORS**: Configured for frontend communication

## API Endpoints

### Authentication (`/api/auth/`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /me` - Get current user info
- `POST /logout` - Logout user
- `POST /refresh` - Refresh access token

### Mentors (`/api/mentors/`)
- `GET /` - List all available mentors
- `GET /<uuid>` - Get mentor details
- `PUT /profile/me` - Update mentor profile

### Sessions (`/api/sessions/`)
- `GET /` - List user's sessions
- `POST /create` - Create new session booking
- `GET /<uuid>` - Get session details
- `PUT /<uuid>/update` - Update session
- `DELETE /<uuid>/cancel` - Cancel session

## Setup

1. Create virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run migrations:
```bash
python manage.py migrate
```

4. Create superuser:
```bash
python manage.py createsuperuser
```

5. Run server:
```bash
python manage.py runserver 8000
```

## Testing

The backend is compatible with the existing React frontend. Update your frontend's API URL to:
```
http://localhost:8000/api
```

## Database

Uses SQLite by default. For production, configure PostgreSQL in settings.py.
