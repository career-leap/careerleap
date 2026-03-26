#!/bin/bash
set -e

echo "=============================================="
echo "CareerLeap Django Backend - Container Startup"
echo "=============================================="

# Wait for database to be ready
echo "Waiting for database..."
python << END
import sys
import time
import psycopg2
from psycopg2 import OperationalError

retry_count = 0
max_retries = 30

while retry_count < max_retries:
    try:
        conn = psycopg2.connect(
            dbname="${DB_NAME}",
            user="${DB_USER}",
            password="${DB_PASSWORD}",
            host="${DB_HOST}",
            port="${DB_PORT}"
        )
        conn.close()
        print("Database is ready!")
        sys.exit(0)
    except OperationalError:
        retry_count += 1
        print(f"Database not ready, retrying... ({retry_count}/{max_retries})")
        time.sleep(2)

print("Could not connect to database!")
sys.exit(1)
END

echo "Running database migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput 2>/dev/null || true

echo "=============================================="
echo "Startup complete!"
echo "=============================================="

# Execute the main command
exec "$@"
