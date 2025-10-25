# Installation Guide

This guide provides detailed instructions for setting up HealthMate in various environments.

## Table of Contents

- [System Requirements](#system-requirements)
- [Local Development Setup](#local-development-setup)
- [Database Setup](#database-setup)
- [Backend Configuration](#backend-configuration)
- [Frontend Configuration](#frontend-configuration)
- [Docker Setup](#docker-setup)
- [Verification](#verification)

## System Requirements

### Minimum Requirements

- **Operating System**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 20.04+ recommended)
- **RAM**: 8 GB minimum, 16 GB recommended
- **Disk Space**: 5 GB free space
- **Internet Connection**: Required for downloading dependencies

### Software Requirements

| Software | Version | Purpose |
|----------|---------|---------|
| Java JDK | 17+ | Backend runtime |
| Node.js | 18+ | Frontend development |
| PostgreSQL | 14+ | Database |
| Maven | 3.8+ | Build tool (optional, wrapper included) |
| Git | 2.30+ | Version control |

## Local Development Setup

### 1. Install Java Development Kit (JDK)

#### Windows
```bash
# Download and install from https://adoptium.net/
# Or use chocolatey
choco install temurin17
```

#### macOS
```bash
# Using Homebrew
brew install openjdk@17
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install openjdk-17-jdk
```

Verify installation:
```bash
java -version
javac -version
```

### 2. Install Node.js and npm

#### Windows
```bash
# Download from https://nodejs.org/
# Or use chocolatey
choco install nodejs
```

#### macOS
```bash
# Using Homebrew
brew install node
```

#### Linux (Ubuntu/Debian)
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

Verify installation:
```bash
node --version
npm --version
```

### 3. Install PostgreSQL

#### Windows
```bash
# Download from https://www.postgresql.org/download/windows/
# Or use chocolatey
choco install postgresql
```

#### macOS
```bash
# Using Homebrew
brew install postgresql@14
brew services start postgresql@14
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

Verify installation:
```bash
psql --version
```

### 4. Install Maven (Optional)

The project includes Maven wrapper (`mvnw`), so Maven installation is optional.

#### If you prefer to install Maven globally:

**Windows**:
```bash
choco install maven
```

**macOS**:
```bash
brew install maven
```

**Linux**:
```bash
sudo apt install maven
```

## Database Setup

### 1. Create Database User

```bash
# Access PostgreSQL shell
sudo -u postgres psql

# Create user (replace 'yourpassword' with a strong password)
CREATE USER healthmate_user WITH PASSWORD 'yourpassword';

# Grant privileges
ALTER USER healthmate_user WITH SUPERUSER;

# Exit PostgreSQL shell
\q
```

### 2. Create Database

```bash
# Access PostgreSQL as the new user
psql -U postgres

# Create database
CREATE DATABASE healthmate;

# Grant all privileges
GRANT ALL PRIVILEGES ON DATABASE healthmate TO healthmate_user;

# Exit
\q
```

### 3. Verify Database Connection

```bash
psql -U healthmate_user -d healthmate -h localhost
```

## Backend Configuration

### 1. Clone Repository

```bash
git clone https://github.com/Skywalker690/Healthmate1.git
cd Healthmate1
```

### 2. Configure Environment Variables

Navigate to the backend resources directory:
```bash
cd server/src/main/resources
```

Create `.env` file from example:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Database Configuration
DB_URL=jdbc:postgresql://localhost:5432/healthmate
DB_USER=healthmate_user
DB_PASSWORD=yourpassword

# JWT Configuration (Generate a secure secret key - minimum 256 bits)
JWT_SECRET=your-super-secret-jwt-key-make-it-at-least-256-bits-long-for-security
```

### 3. Generate JWT Secret

For production, generate a secure JWT secret:
```bash
# Using openssl
openssl rand -base64 64

# Or using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

### 4. Build Backend

Navigate to server directory:
```bash
cd ../../..  # Back to server root
# Or: cd /path/to/Healthmate1/server
```

Build the project:
```bash
# Using Maven wrapper (recommended)
./mvnw clean install

# Or if Maven is installed globally
mvn clean install
```

### 5. Run Backend

```bash
# Using Maven wrapper
./mvnw spring-boot:run

# Or using Maven
mvn spring-boot:run

# Or run the JAR directly
java -jar target/healthmate-0.0.1-SNAPSHOT.jar
```

The backend will start on `http://localhost:8080`

## Frontend Configuration

### 1. Navigate to Client Directory

```bash
cd ../client
# Or: cd /path/to/Healthmate1/client
```

### 2. Configure Environment Variables

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env`:
```env
REACT_APP_API_URL=http://localhost:8080
```

### 3. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React and React DOM
- React Router
- Axios
- Tailwind CSS
- Heroicons
- Framer Motion

### 4. Run Frontend

```bash
npm start
```

The frontend will start on `http://localhost:3000` and automatically open in your browser.

## Docker Setup

### Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+ (optional)

### Install Docker

#### Windows/macOS
Download and install Docker Desktop from https://www.docker.com/products/docker-desktop

#### Linux
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

### Build and Run Backend with Docker

```bash
cd server

# Build Docker image
docker build -t healthmate-backend .

# Run container
docker run -p 8080:8080 \
  -e DB_URL=jdbc:postgresql://host.docker.internal:5432/healthmate \
  -e DB_USER=healthmate_user \
  -e DB_PASSWORD=yourpassword \
  -e JWT_SECRET=your-jwt-secret \
  healthmate-backend
```

**Note**: On Linux, replace `host.docker.internal` with your machine's IP address.

### Using Docker Compose (Future Enhancement)

A `docker-compose.yml` file can be created to run both backend and database together.

## Verification

### 1. Test Backend Health

```bash
curl http://localhost:8080/actuator/health
```

### 2. Test API Endpoints

Register a user:
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "phoneNumber": "1234567890",
    "role": "ROLE_PATIENT",
    "gender": "MALE",
    "dateOfBirth": "1990-01-01",
    "address": "123 Test St"
  }'
```

Login:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Test Frontend

1. Open browser to `http://localhost:3000`
2. You should see the HealthMate landing page
3. Click "Login" or "Register" to test authentication
4. Register a new account and verify you can login

## Troubleshooting

### Backend Issues

**Port 8080 already in use:**
```bash
# Find process using port 8080
# Linux/macOS:
lsof -i :8080
# Windows:
netstat -ano | findstr :8080

# Kill the process or change server.port in application.properties
```

**Database connection failed:**
- Verify PostgreSQL is running: `sudo systemctl status postgresql` (Linux)
- Check database credentials in `.env`
- Ensure database exists: `psql -U postgres -l`

**JWT Token errors:**
- Ensure JWT_SECRET is at least 256 bits (32 characters)
- Check that `.env` file is in the correct location

### Frontend Issues

**npm install fails:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

**API connection refused:**
- Verify backend is running on port 8080
- Check REACT_APP_API_URL in `.env`
- Check browser console for CORS errors

### Database Issues

**Cannot connect to PostgreSQL:**
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Start PostgreSQL if not running
sudo systemctl start postgresql
```

**Permission denied:**
```bash
# Reset user password
sudo -u postgres psql
ALTER USER healthmate_user WITH PASSWORD 'newpassword';
```

## Next Steps

After successful installation:

1. Read [DEVELOPMENT.md](DEVELOPMENT.md) for development guidelines
2. Check [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API details
3. Review [SECURITY.md](SECURITY.md) for security best practices
4. See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment

## Support

For installation issues:
- Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- Open an issue on GitHub
- Review existing issues for solutions
