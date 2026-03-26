# CareerLeap Docker Makefile
# Provides convenient commands for managing the Docker environment

.PHONY: help build up down restart logs shell migrate superuser clean

# Default target
help:
	@echo "CareerLeap Docker Commands:"
	@echo "============================"
	@echo "  make build      - Build all Docker images"
	@echo "  make up         - Start all services in detached mode"
	@echo "  make down       - Stop and remove all containers"
	@echo "  make restart    - Restart all services"
	@echo "  make logs       - View logs from all services"
	@echo "  make backend    - Access backend container shell"
	@echo "  make frontend   - Access frontend container shell"
	@echo "  make migrate    - Run Django migrations"
	@echo "  make superuser  - Create Django superuser"
	@echo "  make shell      - Open Django shell"
	@echo "  make clean      - Remove all containers, volumes, and images"
	@echo "  make fresh      - Clean build and start fresh"

# Build all images
build:
	docker-compose build

# Start all services
up:
	docker-compose up -d

# Stop all services
down:
	docker-compose down

# Restart all services
restart:
	docker-compose restart

# View logs
logs:
	docker-compose logs -f

# Backend shell
backend:
	docker-compose exec backend /bin/bash

# Frontend shell
frontend:
	docker-compose exec frontend /bin/sh

# Run migrations
migrate:
	docker-compose exec backend python manage.py migrate

# Create superuser
superuser:
	docker-compose exec backend python manage.py createsuperuser

# Django shell
shell:
	docker-compose exec backend python manage.py shell

# Clean everything
clean:
	docker-compose down -v --rmi all

# Fresh start
fresh: clean build up
	@echo "Fresh start complete! Waiting for services..."
	@sleep 5
	@echo ""
	@echo "Services should be available at:"
	@echo "  Frontend: http://localhost:5177"
	@echo "  Backend API: http://localhost:8000"
	@echo "  Adminer: http://localhost:8080"
	@echo ""
	@echo "Run 'make migrate' to apply database migrations"
	@echo "Run 'make superuser' to create an admin user"

# Database backup
backup:
	docker-compose exec db pg_dump -U careerleap_user -d careerleap > backup_$$(date +%Y%m%d_%H%M%S).sql

# Database restore (usage: make restore FILE=backup_20240101_120000.sql)
restore:
	@if [ -z "$(FILE)" ]; then \
		echo "Usage: make restore FILE=backup_file.sql"; \
		exit 1; \
	fi
	cat $(FILE) | docker-compose exec -T db psql -U careerleap_user -d careerleap
