# Backend Setup & Configuration

## Prerequisites

Before setting up the HealthMate backend, ensure you have the following installed:

- **Java 17** or higher
- **Maven 3.8+** or higher
- **PostgreSQL 14+** or higher
- **Redis 7+** or higher
- **Git**
- **IDE** (IntelliJ IDEA, Eclipse, or VS Code with Java extensions)

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/Skywalker690/healthmate.git
cd healthmate/server
```

### 2. Install PostgreSQL

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### macOS (Homebrew)
```bash
brew install postgresql@14
brew services start postgresql@14
```

#### Windows
Download and install from: https://www.postgresql.org/download/windows/

### 3. Create Database

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create database
CREATE DATABASE healthmate;

# Create user (optional)
CREATE USER healthmate_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE healthmate TO healthmate_user;

# Exit
\q
```

### 4. Install Redis

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install redis-server
sudo systemctl start redis
sudo systemctl enable redis
```

#### macOS (Homebrew)
```bash
brew install redis
brew services start redis
```

#### Windows
Download from: https://github.com/microsoftarchive/redis/releases

#### Verify Redis Installation
```bash
redis-cli ping
# Should return: PONG
```

### 5. Configure Environment Variables

Create a `.env` file in the server directory:

```bash
cd server
cp .env.example .env
```

Edit `.env` file:

```properties
# JWT Configuration
JWT_SECRET=

# Database Configuration
DB_URL=jdbc:postgresql://localhost:5432/healthmate
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# Email Configuration
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_specific_password

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

### 6. Update application.yml

The `application.yml` file in `src/main/resources/` should reference environment variables:

```yaml
spring:
  datasource:
    url: ${DB_URL:jdbc:postgresql://localhost:5432/healthmate}
    username: ${DB_USER:}
    password: ${DB_PASSWORD:}
    driver-class-name: org.postgresql.Driver

  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        format_sql: true

  mail:
    host: smtp.gmail.com
    port: 587
    username: ${MAIL_USERNAME}
    password: ${MAIL_PASSWORD}
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true

  data:
    redis:
      host: ${REDIS_HOST:localhost}
      port: ${REDIS_PORT:6379}
      password: ${REDIS_PASSWORD:}
      timeout: 60000

  cache:
    type: redis
    redis:
      time-to-live: 600000

jwt:
  secret: ${JWT_SECRET:}
```

## Gmail Configuration for Email Service

### Generate App Password

1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security**
3. Enable **2-Step Verification**
4. Go to **App passwords**
5. Select **Mail** as the app
6. Select **Other (Custom name)** as the device
7. Enter "HealthMate" and click **Generate**
8. Copy the 16-character password
9. Use this password in `MAIL_PASSWORD` environment variable

## Building the Application

### Using Maven Wrapper (Recommended)

```bash
# Unix/Linux/macOS
./mvnw clean install

# Windows
mvnw.cmd clean install
```

### Using Maven

```bash
mvn clean install
```

### Skip Tests (if needed)

```bash
./mvnw clean install -DskipTests
```

## Running the Application

### Using Maven

```bash
# Unix/Linux/macOS
./mvnw spring-boot:run

# Windows
mvnw.cmd spring-boot:run

# Or with Maven
mvn spring-boot:run
```

### Using Java

```bash
# Build JAR
./mvnw clean package

# Run JAR
java -jar target/healthmate-0.0.1-SNAPSHOT.jar
```

### Development Mode

```bash
# With hot reload (Spring Boot DevTools)
./mvnw spring-boot:run -Dspring-boot.run.jvmArguments="-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005"
```

## Verify Installation

### 1. Check Application Status

The application should start on port 8080. Check the logs for:

```
Started HealthmateApplication in X.XXX seconds
```

### 2. Test Health Endpoint

```bash
curl http://localhost:8080/actuator/health
```

### 3. Test Database Connection

Check logs for:
```
HikariPool-1 - Start completed.
```

### 4. Test Redis Connection

Check logs for successful Redis connection or run:
```bash
redis-cli
> KEYS *
```

### 5. Test API Endpoint

```bash
# Register a user
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "firstName": "Test",
    "lastName": "User",
    "role": "PATIENT",
    "phoneNumber": "1234567890",
    "gender": "MALE"
  }'
```

## IDE Setup

### IntelliJ IDEA

1. **Open Project**: File → Open → Select `server` directory
2. **Import as Maven Project**: IntelliJ should auto-detect
3. **Enable Annotation Processing**: 
   - Settings → Build, Execution, Deployment → Compiler → Annotation Processors
   - Check "Enable annotation processing"
4. **Install Lombok Plugin**: Settings → Plugins → Search "Lombok"
5. **Run Configuration**:
   - Main class: `com.skywalker.backend.HealthmateApplication`
   - Working directory: `$MODULE_WORKING_DIR$`
   - Environment variables: Load from `.env` file

### VS Code

1. **Install Extensions**:
   - Java Extension Pack
   - Spring Boot Extension Pack
   - Lombok Annotations Support

2. **Open Project**: File → Open Folder → Select `server` directory

3. **Configure Launch**:
Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "java",
      "name": "Spring Boot-HealthmateApplication",
      "request": "launch",
      "cwd": "${workspaceFolder}",
      "console": "internalConsole",
      "mainClass": "com.skywalker.backend.HealthmateApplication",
      "projectName": "healthmate",
      "args": "",
      "envFile": "${workspaceFolder}/.env"
    }
  ]
}
```

### Eclipse

1. **Import Project**: File → Import → Maven → Existing Maven Projects
2. **Select Directory**: Browse to `server` directory
3. **Install Lombok**: 
   - Download from https://projectlombok.org/download
   - Run `java -jar lombok.jar`
   - Select Eclipse installation directory
4. **Run As**: Java Application → Select `HealthmateApplication`

## Running Tests

### Run All Tests

```bash
./mvnw test
```

### Run Specific Test Class

```bash
./mvnw test -Dtest=UserServiceTest
```

### Run with Coverage

```bash
./mvnw clean test jacoco:report
```

View coverage report: `target/site/jacoco/index.html`

## Docker Setup (Optional)

### Using Docker Compose

Create `docker-compose.yml` in the server directory:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    container_name: healthmate-postgres
    environment:
      POSTGRES_DB: healthmate
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - healthmate-network

  redis:
    image: redis:7-alpine
    container_name: healthmate-redis
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    networks:
      - healthmate-network

  backend:
    build: .
    container_name: healthmate-backend
    environment:
      DB_URL: jdbc:postgresql://postgres:5432/healthmate
      DB_USER: postgres
      DB_PASSWORD: postgres
      REDIS_HOST: redis
      REDIS_PORT: 6379
      MAIL_USERNAME: ${MAIL_USERNAME}
      MAIL_PASSWORD: ${MAIL_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
    ports:
      - "8080:8080"
    depends_on:
      - postgres
      - redis
    networks:
      - healthmate-network

volumes:
  postgres-data:
  redis-data:

networks:
  healthmate-network:
    driver: bridge
```

### Create Dockerfile

```dockerfile
FROM maven:3.8-openjdk-17-slim AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Run with Docker

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down

# Rebuild and start
docker-compose up --build -d
```

## Environment Profiles

### Development Profile

```yaml
# application-dev.yml
spring:
  jpa:
    show-sql: true
    hibernate:
      ddl-auto: update

logging:
  level:
    com.skywalker.backend: DEBUG
```

Run with:
```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

### Production Profile

```yaml
# application-prod.yml
spring:
  jpa:
    show-sql: false
    hibernate:
      ddl-auto: validate

logging:
  level:
    com.skywalker.backend: INFO
```

Run with:
```bash
java -jar target/healthmate-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
```

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 8080
lsof -i :8080  # macOS/Linux
netstat -ano | findstr :8080  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Or change port in application.yml
server:
  port: 8081
```

### Database Connection Failed

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list  # macOS

# Check connection
psql -U postgres -d healthmate -h localhost

# Verify credentials in application.yml
```

### Redis Connection Failed

```bash
# Check Redis is running
redis-cli ping

# Start Redis
sudo systemctl start redis  # Linux
brew services start redis  # macOS

# Check Redis logs
sudo tail -f /var/log/redis/redis-server.log  # Linux
```

### Lombok Not Working

```bash
# IntelliJ IDEA
# Settings → Plugins → Install Lombok
# Settings → Annotation Processors → Enable

# Eclipse
# Run lombok.jar installer

# VS Code
# Install "Lombok Annotations Support" extension
```

### Email Sending Failed

1. Verify Gmail credentials
2. Check app-specific password
3. Enable "Less secure app access" (not recommended)
4. Check spam folder
5. Verify SMTP settings

### Build Failed

```bash
# Clean Maven cache
./mvnw clean

# Update dependencies
./mvnw dependency:purge-local-repository

# Skip tests
./mvnw clean install -DskipTests
```

## Performance Tuning

### JVM Options

```bash
java -Xms512m -Xmx2048m -XX:+UseG1GC -jar target/healthmate-0.0.1-SNAPSHOT.jar
```

### Database Connection Pool

```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 10
      minimum-idle: 5
      connection-timeout: 30000
      idle-timeout: 600000
      max-lifetime: 1800000
```

### Redis Configuration

```yaml
spring:
  data:
    redis:
      lettuce:
        pool:
          max-active: 8
          max-idle: 8
          min-idle: 2
```

## Security Considerations

1. **Change Default Credentials**: Update database and Redis passwords
2. **Use Strong JWT Secret**: Generate a secure random key
3. **Enable HTTPS**: Use SSL/TLS in production
4. **Secure Environment Variables**: Use secrets management (AWS Secrets Manager, HashiCorp Vault)
5. **Rate Limiting**: Implement API rate limiting
6. **Firewall**: Restrict database and Redis access

## Deployment

### Production Checklist

- [ ] Update `application-prod.yml` with production settings
- [ ] Set `spring.jpa.hibernate.ddl-auto` to `validate`
- [ ] Disable SQL logging (`show-sql: false`)
- [ ] Use environment variables for sensitive data
- [ ] Enable HTTPS/TLS
- [ ] Configure proper logging (file-based)
- [ ] Set up database backups
- [ ] Configure monitoring (Prometheus, Grafana)
- [ ] Set up health checks
- [ ] Configure CORS for production frontend URL
- [ ] Enable production error handling
- [ ] Set up CI/CD pipeline

### Build Production JAR

```bash
./mvnw clean package -Pprod -DskipTests
```

### Run Production

```bash
java -jar -Dspring.profiles.active=prod target/healthmate-0.0.1-SNAPSHOT.jar
```

## Useful Commands

```bash
# Clean build
./mvnw clean install

# Run with specific profile
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# Generate sources
./mvnw generate-sources

# View dependency tree
./mvnw dependency:tree

# Check for updates
./mvnw versions:display-dependency-updates

# Format code
./mvnw spring-javaformat:apply

# Run checkstyle
./mvnw checkstyle:check
```

## Next Steps

1. Review the [API Documentation](API.md)
2. Understand the [Architecture](ARCHITECTURE.md)
3. Learn about [WebSocket Communication](WEBSOCKET.md)
4. Explore [Caching Strategy](CACHING.md)
5. Review [Security Implementation](SECURITY.md)
6. Check [Database Schema](DATABASE.md)
7. Configure [Email Service](EMAIL.md)
