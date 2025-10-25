# Deployment Guide

Complete guide for deploying HealthMate to production environments.

## Table of Contents

- [Overview](#overview)
- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Docker Deployment](#docker-deployment)
- [Cloud Deployment](#cloud-deployment)
- [Database Setup](#database-setup)
- [Environment Configuration](#environment-configuration)
- [CI/CD Pipeline](#cicd-pipeline)
- [Monitoring and Logging](#monitoring-and-logging)
- [Backup Strategy](#backup-strategy)
- [Security Hardening](#security-hardening)
- [Scaling](#scaling)

## Overview

This guide covers various deployment strategies for HealthMate, from simple Docker deployments to cloud-based production environments.

### Deployment Architecture

```
┌────────────────────────────────────────────────┐
│              Load Balancer / CDN               │
│              (CloudFlare, AWS ELB)             │
└───────────────────┬────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
┌───────▼────────┐      ┌──────▼──────────┐
│   Frontend     │      │    Backend       │
│   (Static)     │      │   (Container)    │
│   S3/Netlify   │      │   ECS/App Svc    │
└────────────────┘      └──────┬───────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
            ┌───────▼────────┐    ┌──────▼──────┐
            │   Database     │    │    Redis    │
            │   (RDS/Azure)  │    │   (Cache)   │
            └────────────────┘    └─────────────┘
```

## Pre-Deployment Checklist

### Security

- [ ] Change all default passwords
- [ ] Generate production JWT secret (512 bits)
- [ ] Enable HTTPS with valid SSL certificate
- [ ] Configure CORS for production domain only
- [ ] Enable database SSL connections
- [ ] Set up firewall rules
- [ ] Review and minimize error messages
- [ ] Implement rate limiting
- [ ] Enable security headers

### Configuration

- [ ] Set environment variables
- [ ] Configure database connection pool
- [ ] Set appropriate log levels
- [ ] Configure file upload limits
- [ ] Set session timeout
- [ ] Configure email service (if applicable)

### Testing

- [ ] Run all tests
- [ ] Perform security audit
- [ ] Load testing
- [ ] Test backup and recovery
- [ ] Verify SSL/TLS configuration

### Monitoring

- [ ] Set up application monitoring
- [ ] Configure log aggregation
- [ ] Set up alerts
- [ ] Configure health checks
- [ ] Set up error tracking

## Docker Deployment

### Backend Docker Build

**Dockerfile** (already in `server/Dockerfile`):
```dockerfile
# Build stage
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline
COPY src ./src
RUN ./mvnw clean package -DskipTests

# Run stage
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**Build and Run**:
```bash
cd server

# Build image
docker build -t healthmate-backend:latest .

# Run container
docker run -d \
  --name healthmate-backend \
  -p 8080:8080 \
  -e DB_URL=jdbc:postgresql://db-host:5432/healthmate \
  -e DB_USER=healthmate_user \
  -e DB_PASSWORD=secure_password \
  -e JWT_SECRET=your-super-secure-jwt-secret \
  healthmate-backend:latest
```

### Frontend Docker Build

**Create Dockerfile** for frontend:
```dockerfile
# client/Dockerfile
# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf**:
```nginx
server {
    listen 80;
    server_name _;
    
    root /usr/share/nginx/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://backend:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Docker Compose

**docker-compose.yml**:
```yaml
version: '3.8'

services:
  # PostgreSQL Database
  database:
    image: postgres:14-alpine
    container_name: healthmate-db
    environment:
      POSTGRES_DB: healthmate
      POSTGRES_USER: healthmate_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - healthmate-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U healthmate_user"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Backend Service
  backend:
    build: ./server
    container_name: healthmate-backend
    environment:
      DB_URL: jdbc:postgresql://database:5432/healthmate
      DB_USER: healthmate_user
      DB_PASSWORD: ${DB_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
    ports:
      - "8080:8080"
    depends_on:
      database:
        condition: service_healthy
    networks:
      - healthmate-network
    restart: unless-stopped

  # Frontend Service
  frontend:
    build: ./client
    container_name: healthmate-frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - healthmate-network
    restart: unless-stopped

volumes:
  postgres_data:

networks:
  healthmate-network:
    driver: bridge
```

**Run with Docker Compose**:
```bash
# Create .env file
cat > .env << EOF
DB_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret_512_bits
EOF

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## Cloud Deployment

### AWS Deployment

#### Architecture

```
Route 53 → CloudFront → S3 (Frontend)
                       → ALB → ECS (Backend) → RDS PostgreSQL
```

#### Backend on AWS ECS

1. **Create ECR Repository**:
```bash
aws ecr create-repository --repository-name healthmate-backend
```

2. **Build and Push Image**:
```bash
# Authenticate Docker to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Build image
docker build -t healthmate-backend ./server

# Tag image
docker tag healthmate-backend:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/healthmate-backend:latest

# Push image
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/healthmate-backend:latest
```

3. **Create ECS Task Definition**:
```json
{
  "family": "healthmate-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [
    {
      "name": "healthmate-backend",
      "image": "YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/healthmate-backend:latest",
      "portMappings": [
        {
          "containerPort": 8080,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "DB_URL",
          "value": "jdbc:postgresql://your-rds-endpoint:5432/healthmate"
        }
      ],
      "secrets": [
        {
          "name": "DB_PASSWORD",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:db-password"
        },
        {
          "name": "JWT_SECRET",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:jwt-secret"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/healthmate-backend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

4. **Create RDS PostgreSQL**:
```bash
aws rds create-db-instance \
  --db-instance-identifier healthmate-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username healthmate_user \
  --master-user-password YOUR_PASSWORD \
  --allocated-storage 20 \
  --vpc-security-group-ids sg-xxxxx \
  --db-subnet-group-name your-subnet-group
```

#### Frontend on S3 + CloudFront

1. **Build Frontend**:
```bash
cd client
npm run build
```

2. **Create S3 Bucket**:
```bash
aws s3 mb s3://healthmate-frontend
aws s3 sync build/ s3://healthmate-frontend/
```

3. **Configure S3 for Static Website**:
```bash
aws s3 website s3://healthmate-frontend/ \
  --index-document index.html \
  --error-document index.html
```

4. **Create CloudFront Distribution**:
```bash
aws cloudfront create-distribution \
  --origin-domain-name healthmate-frontend.s3.amazonaws.com \
  --default-root-object index.html
```

### Azure Deployment

#### Backend on Azure App Service

1. **Create App Service Plan**:
```bash
az appservice plan create \
  --name healthmate-plan \
  --resource-group healthmate-rg \
  --sku B1 \
  --is-linux
```

2. **Create Web App**:
```bash
az webapp create \
  --name healthmate-backend \
  --resource-group healthmate-rg \
  --plan healthmate-plan \
  --runtime "JAVA|17-java17"
```

3. **Deploy JAR**:
```bash
cd server
./mvnw clean package
az webapp deploy \
  --resource-group healthmate-rg \
  --name healthmate-backend \
  --src-path target/healthmate-0.0.1-SNAPSHOT.jar
```

4. **Configure App Settings**:
```bash
az webapp config appsettings set \
  --resource-group healthmate-rg \
  --name healthmate-backend \
  --settings \
    DB_URL="jdbc:postgresql://healthmate-db.postgres.database.azure.com:5432/healthmate" \
    DB_USER="healthmate_user@healthmate-db" \
    DB_PASSWORD="@Microsoft.KeyVault(SecretUri=https://keyvault.vault.azure.net/secrets/db-password/)" \
    JWT_SECRET="@Microsoft.KeyVault(SecretUri=https://keyvault.vault.azure.net/secrets/jwt-secret/)"
```

#### Database on Azure PostgreSQL

```bash
az postgres server create \
  --name healthmate-db \
  --resource-group healthmate-rg \
  --location eastus \
  --admin-user healthmate_user \
  --admin-password YOUR_PASSWORD \
  --sku-name B_Gen5_1 \
  --version 14
```

### Google Cloud Platform

#### Backend on Cloud Run

```bash
# Build and deploy
gcloud builds submit --tag gcr.io/PROJECT_ID/healthmate-backend
gcloud run deploy healthmate-backend \
  --image gcr.io/PROJECT_ID/healthmate-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## Database Setup

### Production Database Configuration

**application.properties** (production):
```properties
# Database
spring.datasource.url=${env.DB_URL}
spring.datasource.username=${env.DB_USER}
spring.datasource.password=${env.DB_PASSWORD}
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=false

# Connection Pool
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=30000
spring.datasource.hikari.idle-timeout=600000
spring.datasource.hikari.max-lifetime=1800000

# SSL
spring.datasource.url=jdbc:postgresql://host:5432/db?sslmode=require
```

### Database Migrations

Use Flyway for production:

**pom.xml**:
```xml
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
```

**application.properties**:
```properties
spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration
spring.flyway.baseline-on-migrate=true
```

## Environment Configuration

### Environment Variables

**Required Variables**:
```bash
# Database
DB_URL=jdbc:postgresql://host:5432/healthmate
DB_USER=healthmate_user
DB_PASSWORD=secure_password

# Security
JWT_SECRET=512_bit_random_secret

# Application
SPRING_PROFILES_ACTIVE=prod
SERVER_PORT=8080

# Optional
LOG_LEVEL=INFO
MAX_FILE_SIZE=10MB
```

### Secrets Management

**AWS Secrets Manager**:
```bash
# Store secret
aws secretsmanager create-secret \
  --name healthmate/db-password \
  --secret-string "your_password"

# Retrieve secret
aws secretsmanager get-secret-value \
  --secret-id healthmate/db-password
```

**Azure Key Vault**:
```bash
# Store secret
az keyvault secret set \
  --vault-name healthmate-kv \
  --name db-password \
  --value "your_password"

# Reference in app
@Microsoft.KeyVault(SecretUri=https://healthmate-kv.vault.azure.net/secrets/db-password/)
```

## CI/CD Pipeline

### GitHub Actions

**.github/workflows/deploy.yml**:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up JDK 17
        uses: actions/setup-java@v3
        with:
          java-version: '17'
          distribution: 'temurin'
      
      - name: Run tests
        run: |
          cd server
          ./mvnw test

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1
      
      - name: Build and push Docker image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: healthmate-backend
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG ./server
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
      
      - name: Deploy to ECS
        run: |
          aws ecs update-service \
            --cluster healthmate-cluster \
            --service healthmate-backend \
            --force-new-deployment
```

## Monitoring and Logging

### Application Monitoring

**Spring Boot Actuator**:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

**Expose endpoints**:
```properties
management.endpoints.web.exposure.include=health,info,metrics
management.endpoint.health.show-details=when-authorized
```

### Centralized Logging

**ELK Stack** (Elasticsearch, Logstash, Kibana):
```properties
# Logback configuration
logging.pattern.console=%d{yyyy-MM-dd HH:mm:ss} - %msg%n
logging.file.name=logs/healthmate.log
logging.file.max-size=10MB
logging.file.max-history=30
```

### Error Tracking

**Sentry Integration**:
```xml
<dependency>
    <groupId>io.sentry</groupId>
    <artifactId>sentry-spring-boot-starter</artifactId>
    <version>6.x.x</version>
</dependency>
```

## Backup Strategy

### Automated Backups

**PostgreSQL on AWS RDS**:
- Automated daily backups
- Point-in-time recovery
- Retention period: 7-35 days

**Manual Backup Script**:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"

# Database backup
pg_dump -h db-host -U user -d healthmate | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Upload to S3
aws s3 cp $BACKUP_DIR/db_$DATE.sql.gz s3://healthmate-backups/

# Cleanup old backups
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +7 -delete
```

## Security Hardening

### SSL/TLS Configuration

```properties
# Force HTTPS
server.ssl.enabled=true
server.ssl.key-store=classpath:keystore.p12
server.ssl.key-store-password=${KEYSTORE_PASSWORD}
server.ssl.key-store-type=PKCS12
```

### Security Headers

```java
http.headers()
    .contentSecurityPolicy("default-src 'self'")
    .and()
    .xssProtection()
    .and()
    .frameOptions().deny()
    .and()
    .httpStrictTransportSecurity()
        .maxAgeInSeconds(31536000);
```

## Scaling

### Horizontal Scaling

- Multiple backend instances behind load balancer
- Stateless authentication (JWT)
- No session affinity required

### Vertical Scaling

- Increase instance size
- Adjust connection pool
- Optimize database queries

### Database Scaling

- Read replicas for queries
- Connection pooling
- Query optimization
- Caching layer (Redis)

## Post-Deployment

### Health Check

```bash
# Backend health
curl https://api.yourdomain.com/actuator/health

# Frontend check
curl https://yourdomain.com
```

### Performance Testing

```bash
# Load testing with Apache Bench
ab -n 1000 -c 10 https://api.yourdomain.com/api/users/me

# Or use K6, JMeter, Gatling
```

### Monitoring

- Set up alerts for errors
- Monitor response times
- Track database performance
- Monitor resource usage

## Rollback Plan

In case of issues:

1. **Revert code**: Deploy previous version
2. **Database**: Restore from backup if needed
3. **DNS**: Switch to previous environment
4. **Notify**: Communicate with stakeholders

## Support

For deployment issues:
- Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- Review logs and metrics
- Contact DevOps team
- Open support ticket

## Conclusion

This guide provides multiple deployment options. Choose based on:
- Budget
- Scalability requirements
- Team expertise
- Compliance requirements

For more details, see [ARCHITECTURE.md](ARCHITECTURE.md) and [SECURITY.md](SECURITY.md).
