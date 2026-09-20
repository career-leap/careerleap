# CareerLeap Docker Makefile
# Provides convenient commands for managing the Docker environment

.PHONY: help build up down restart logs shell migrate superuser clean graphify graphify-update graphify-serve graphify-serve-stdio graphify-install

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
	@echo "  make graphify-install - Install project-scoped Graphify skill"
	@echo "  make graphify   - Build knowledge graph (code only)"
	@echo "  make graphify-update  - Incrementally update knowledge graph"
	@echo "  make graphify-serve   - Serve graph over HTTP (curl/browser)"
	@echo "  make graphify-serve-stdio - Serve graph as stdio MCP server"

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

# ---------------------------------------------------------------------------
# Graphify knowledge graph (https://graphify.net)
# ---------------------------------------------------------------------------

# Install the project-scoped skill for Kimi Code and register the graph hook.
# Requires `uv tool install graphifyy` or `pip install graphifyy` first.
graphify-install:
	graphify install --project --platform kimi
	@echo "Graphify skill installed. Run 'make graphify' to build the graph."

# Build a fresh knowledge graph of the entire repo (code only, no LLM cost).
graphify:
	graphify . --code-only

# Incrementally update the graph after code changes.
graphify-update:
	graphify . --code-only --update

# Serve the generated graph over HTTP so you can query it with curl or a browser.
# Defaults to http://127.0.0.1:8080/mcp
# Requires the MCP extra: uv tool install --upgrade "graphifyy[mcp]"
graphify-serve:
	graphify-mcp graphify-out/graph.json --transport http --host 127.0.0.1 --port 8080 --json-response

# Serve the graph as a stdio MCP server (for Kimi Code / Claude Code / Codex).
# Run this only when an MCP client is connected; it will exit if run standalone.
graphify-serve-stdio:
	graphify-mcp graphify-out/graph.json
