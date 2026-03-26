# CareerLeap React Frontend Dockerfile
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy project files
COPY . .

# Expose Vite dev server port
EXPOSE 5177

# Start development server on port 5177
CMD ["npm", "run", "dev", "--", "--host", "--port", "5177"]
