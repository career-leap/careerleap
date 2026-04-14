#!/usr/bin/env bash
# Render build script for CareerLeap Django backend
set -o errexit

echo "🚀 Building CareerLeap backend..."

# Change to backend_django directory where requirements.txt is located
cd backend_django

# Install dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Collect static files (this doesn't need database)
echo "📁 Collecting static files..."
python manage.py collectstatic --no-input

# Note: Migrations are skipped during build because DATABASE_URL is not yet configured
# Run migrations manually after setting DATABASE_URL environment variable:
#   cd backend_django && python manage.py migrate
# Or use the shell in Render Dashboard

# Create superuser if environment variables are provided (optional)
# This will also be done manually after database setup

echo "✅ Build completed successfully!"
echo ""
echo "⚠️  IMPORTANT: After setting DATABASE_URL environment variable:"
echo "   1. Go to the service shell in Render Dashboard"
echo "   2. Run: cd backend_django && python manage.py migrate"
echo "   3. (Optional) Create superuser: python manage.py createsuperuser"
