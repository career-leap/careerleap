# PostgreSQL Docker Setup for CareerLeap

This document describes the PostgreSQL database setup using Docker for the CareerLeap Django backend.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Docker Compose                            │
│  ┌─────────────────────────┐    ┌───────────────────────┐  │
│  │  PostgreSQL 16 Alpine   │    │      Adminer          │  │
│  │  Port: 5432             │    │  Port: 8080           │  │
│  │  Database: careerleap   │    │  DB Management UI     │  │
│  │  User: careerleap_user  │    │                       │  │
│  │  Password: careerleap_pass    │                       │  │
│  └─────────────────────────┘    └───────────────────────┘  │
│            │                              │                  │
│            └──────────────────────────────┘                  │
│                         │                                    │
│              Shared Network + Volume                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ psycopg2-binary
                              │
                   ┌──────────▼──────────┐
                   │   Django Backend    │
                   │   Port: 8000        │
                   └─────────────────────┘
```

## Services

### 1. PostgreSQL Database (`careerleap_postgres`)
- **Image:** `postgres:16-alpine`
- **Port:** `5432:5432`
- **Database:** `careerleap`
- **Username:** `careerleap_user`
- **Password:** `careerleap_pass`
- **Volume:** `postgres_data` (persistent storage)

### 2. Adminer (`careerleap_adminer`)
- **Image:** `adminer:latest`
- **Port:** `8080:8080`
- **Purpose:** Web-based database management UI

## Quick Start

### Start the Database
```bash
cd backend_django
docker-compose up -d
```

### Stop the Database
```bash
docker-compose down
```

### Stop and Remove Data (Caution!)
```bash
docker-compose down -v
```

## Database Access

### From Django Application
The connection is automatically configured in `settings.py`:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'careerleap',
        'USER': 'careerleap_user',
        'PASSWORD': 'careerleap_pass',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

### Using Adminer (Web UI)
1. Open: http://localhost:8080
2. Login credentials:
   - **System:** PostgreSQL
   - **Server:** db (or localhost if accessing from host)
   - **Username:** careerleap_user
   - **Password:** careerleap_pass
   - **Database:** careerleap

### Using psql Command Line
```bash
# From Docker container
docker exec -it careerleap_postgres psql -U careerleap_user -d careerleap

# Common commands:
\dt              # List tables
\d users         # Describe users table
SELECT * FROM users;  # Query users
```

## Database Schema

### Tables Created by Django

| Table | Description |
|-------|-------------|
| `users` | Custom user model with email, names, role, profile info |
| `mentor_profiles` | Mentor-specific data (hourly rate, expertise, etc.) |
| `sessions` | Mentorship session bookings |
| `django_migrations` | Django migration history |
| `django_session` | Django session data |
| `django_admin_log` | Admin action logs |
| `auth_permission` | Django permissions |
| `auth_group` | Django groups |
| `users_groups` | User-group associations |
| `users_user_permissions` | User-permission associations |

### Key Database Fields

#### users table
```sql
id                   UUID PRIMARY KEY
email                VARCHAR(255) UNIQUE
password             VARCHAR(255)
first_name           VARCHAR(255)
last_name            VARCHAR(255)
role                 TEXT (mentee/mentor/admin)
bio                  TEXT
industry             VARCHAR(255)
years_of_experience  INTEGER
location             VARCHAR(255)
profile_picture      VARCHAR(255)
is_verified          BOOLEAN
is_active            BOOLEAN
is_staff             BOOLEAN
is_superuser         BOOLEAN
last_login_at        DATETIME
created_at           DATETIME
updated_at           DATETIME
```

#### mentor_profiles table
```sql
id              UUID PRIMARY KEY
user_id         UUID (FK to users)
hourly_rate     DECIMAL(10,2)
expertise       JSON
is_available    BOOLEAN
total_sessions  INTEGER
average_rating  DECIMAL(2,1)
bio             TEXT
created_at      DATETIME
updated_at      DATETIME
```

## Common Operations

### Backup Database
```bash
docker exec careerleap_postgres pg_dump -U careerleap_user careerleap > backup.sql
```

### Restore Database
```bash
cat backup.sql | docker exec -i careerleap_postgres psql -U careerleap_user -d careerleap
```

### Reset Database (All data will be lost!)
```bash
# Stop and remove containers + volumes
docker-compose down -v

# Restart fresh
docker-compose up -d

# Re-run migrations
cd backend_django
source ../venv/bin/activate
python manage.py migrate
python manage.py shell -c "from accounts.models import User; User.objects.create_superuser('admin@careerleap.com', 'Admin', 'User', 'adminpass123')"
```

### View Database Logs
```bash
docker-compose logs -f db
```

## Troubleshooting

### Connection Refused
- Ensure Docker container is running: `docker ps | grep postgres`
- Check port is not in use: `lsof -i :5432`
- Restart container: `docker-compose restart db`

### Authentication Failed
- Verify credentials in `.env` file
- Check user exists: `docker exec careerleap_postgres psql -U careerleap_user -d careerleap -c "\du"`

### Migration Issues
- Delete migration files and recreate:
  ```bash
  find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
  python manage.py makemigrations
  python manage.py migrate
  ```

### Data Persistence
- Data is stored in Docker volume `postgres_data`
- To check volume: `docker volume ls | grep postgres`
- Data persists across container restarts

## Environment Variables

The `.env` file contains database configuration:
```
DB_NAME=careerleap
DB_USER=careerleap_user
DB_PASSWORD=careerleap_pass
DB_HOST=localhost
DB_PORT=5432
```

For production, change these values and use strong passwords!
