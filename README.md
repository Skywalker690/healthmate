# HealthMate 

> A comprehensive healthcare management system for seamless doctor-patient interactions and appointment management.

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.6-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue.svg)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7+-red.svg)](https://redis.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Documentation](#documentation)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

HealthMate Advanced is a modern, full-stack healthcare management platform that streamlines medical appointment scheduling, doctor-patient communication, and healthcare administration. Built with cutting-edge technologies, it provides a robust, scalable, and secure solution for healthcare facilities of all sizes.

### Key Highlights

- 🔐 **Secure Authentication**: JWT-based authentication with role-based access control
- 📅 **Smart Scheduling**: Intelligent appointment booking with time slot management
- 💬 **Real-time Notifications**: WebSocket-based instant notifications for appointments and updates
- ⚡ **High Performance**: Redis caching for optimal response times
- 📧 **Email Integration**: Automated email notifications for OTPs and appointments
- 📊 **Analytics Dashboard**: Comprehensive statistics and insights for administrators
- 🎨 **Modern UI**: Responsive React interface with Tailwind CSS

## ✨ Features

### For Patients
- 👤 User registration and profile management
- 🔍 Browse and search doctors by specialization
- 📅 Book appointments with available time slots
- 📋 View appointment history and status
- 🔔 Real-time notifications for appointment updates
- 🔑 Secure password reset with OTP verification

### For Doctors
- 👨‍⚕️ Professional profile management
- ⏰ Configure weekly working schedules
- 📆 Generate and manage appointment time slots
- 👥 View and manage patient appointments
- 📊 Personal dashboard with appointment statistics
- ✅ Update appointment status (scheduled, completed, cancelled)

### For Administrators
- 🎛️ Complete system oversight and management
- 👥 User, doctor, and patient management
- 📊 Comprehensive analytics dashboard
- 📈 System-wide statistics and metrics
- 🔍 Advanced search and filtering capabilities
- 📋 Audit logs for system activities

## 🛠️ Technology Stack

### Backend
- **Framework**: Spring Boot 3.5.6
- **Language**: Java 17
- **Database**: PostgreSQL 14+
- **Caching**: Redis 7+
- **Security**: Spring Security with JWT
- **WebSocket**: STOMP over SockJS
- **ORM**: Hibernate/JPA
- **Email**: Spring Mail with Gmail SMTP
- **Build Tool**: Maven

### Frontend
- **Framework**: React 19.1.1
- **Routing**: React Router 7.9.3
- **Styling**: Tailwind CSS 3.4.17
- **HTTP Client**: Axios 1.12.2
- **Charts**: Recharts 2.10.3
- **Animations**: Framer Motion 11.0.0
- **WebSocket**: STOMP.js 7.0.0 & SockJS Client 1.6.1

### DevOps & Tools
- **Version Control**: Git
- **API Testing**: Postman
- **Development**: Spring Boot DevTools, React Scripts

## 🏗️ Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                         │
│  (React App - Browser/Mobile)                               │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ HTTPS/REST API
                      │ WebSocket (STOMP)
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Controllers  │  │  WebSocket   │  │     JWT      │       │
│  │   (REST)     │  │   Handler    │  │    Filter    │       │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘       │
│         │                  │                  │             │
│         └──────────────────┼──────────────────┘             │
│                           │                                 │
│  ┌────────────────────────┴─────────────────────────┐       │
│  │              Service Layer                       │       │
│  │  (Business Logic & Transaction Management)       │       │
│  └────────────────────────┬─────────────────────────┘       │
└───────────────────────────┼─────────────────────────────────┘
                            │
                ┌───────────┼───────────┐
                │           │           │
                ▼           ▼           ▼
┌──────────────────┐  ┌──────────┐  ┌──────────┐
│   PostgreSQL     │  │  Redis   │  │   SMTP   │
│   (Database)     │  │ (Cache)  │  │  (Email) │
└──────────────────┘  └──────────┘  └──────────┘
```

### Design Patterns

- **Layered Architecture**: Clear separation of concerns (Controller → Service → Repository)
- **Repository Pattern**: Data access abstraction with Spring Data JPA
- **DTO Pattern**: Data transfer between layers
- **Dependency Injection**: Constructor-based injection with Lombok
- **Builder Pattern**: Response and entity construction
- **Factory Pattern**: Role-based object creation

## 🚀 Getting Started

### Prerequisites

- Java 17 or higher
- Maven 3.8+
- PostgreSQL 14+
- Redis 7+
- Node.js 16+ (for frontend)
- Git

### Quick Start

#### 1. Clone the Repository

```bash
git clone https://github.com/Skywalker690/healthmate.git
cd healthmate
```

#### 2. Setup Backend

```bash
cd server

# Create database
createdb healthmate

# Configure environment variables
cp .env.example .env
# Edit .env with your credentials

# Build and run
./mvnw spring-boot:run
```

Backend will start at `http://localhost:8080`

#### 3. Setup Frontend

```bash
cd ../client

# Install dependencies
npm install

# Start development server
npm start
```

Frontend will start at `http://localhost:3000`

### Detailed Setup Instructions

For comprehensive setup instructions, including:
- Database configuration
- Redis setup
- Email service configuration
- Docker deployment
- IDE setup

Please refer to the [Backend Setup Guide](docs/backend/SETUP.md)

## 📚 Documentation

Comprehensive documentation is available in the `docs/` directory:

### Backend Documentation

- **[Architecture Overview](docs/backend/ARCHITECTURE.md)** - System design, patterns, and components
- **[API Documentation](docs/backend/API.md)** - Complete REST API reference with examples
- **[WebSocket Guide](docs/backend/WEBSOCKET.md)** - Real-time communication implementation
- **[Caching Strategy](docs/backend/CACHING.md)** - Redis caching configuration and usage
- **[Security](docs/backend/SECURITY.md)** - Authentication, authorization, and security best practices
- **[Database Schema](docs/backend/DATABASE.md)** - Entity relationships and database structure
- **[Email Service](docs/backend/EMAIL.md)** - Email configuration and templates
- **[Setup Guide](docs/backend/SETUP.md)** - Installation and configuration instructions

### Postman Collection

Import the Postman collection for easy API testing:
- [HealthMate API Collection](docs/postman/HealthMate-API-Collection.json)

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register              - Register new user
POST   /api/auth/login                 - User login
POST   /api/auth/forgot-password/*     - Password reset flow
```

### Users
```
GET    /api/users                      - Get all users (Admin)
GET    /api/users/me                   - Get current user
PUT    /api/users/me                   - Update current user
GET    /api/users/{id}                 - Get user by ID
```

### Doctors
```
GET    /api/doctors                    - Get all doctors
GET    /api/doctors/{id}               - Get doctor details
POST   /api/doctors/{id}/schedule      - Set doctor schedule
GET    /api/doctors/{id}/slots         - Get available slots
POST   /api/doctors/{id}/slots/generate - Generate time slots
```

### Appointments
```
GET    /api/appointments               - Get all appointments
POST   /api/appointments/{patientId}/{doctorId} - Create appointment
GET    /api/appointments/{id}          - Get appointment details
PUT    /api/appointments/{id}/status   - Update appointment status
DELETE /api/appointments/{id}          - Cancel appointment
```

### Notifications
```
GET    /api/notifications/user/{userId}        - Get user notifications
GET    /api/notifications/user/{userId}/unread - Get unread notifications
PUT    /api/notifications/{id}/read            - Mark as read
GET    /api/notifications/stream/{userId}      - SSE notification stream
```

### Dashboard
```
GET    /api/dashboard/admin            - Admin dashboard stats
GET    /api/dashboard/doctor/{id}      - Doctor dashboard stats
```

For complete API documentation with request/response examples, see [API Documentation](docs/backend/API.md)

## 📁 Project Structure

```
healthmate-advanced/
├── server/                          # Backend (Spring Boot)
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/skywalker/backend/
│   │   │   │   ├── config/          # Configuration classes
│   │   │   │   ├── controller/      # REST controllers
│   │   │   │   ├── dto/             # Data Transfer Objects
│   │   │   │   ├── model/           # Entity models
│   │   │   │   ├── repository/      # JPA repositories
│   │   │   │   ├── security/        # Security components
│   │   │   │   ├── service/         # Business logic
│   │   │   │   ├── domain/          # Enumerations
│   │   │   │   └── exception/       # Exception handling
│   │   │   └── resources/
│   │   │       ├── application.yml  # Application configuration
│   │   │       └── data.sql         # Initial data
│   │   └── test/                    # Test cases
│   ├── pom.xml                      # Maven dependencies
│   └── .env.example                 # Environment variables template
│
├── client/                          # Frontend (React)
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   │   ├── common/              # Common components
│   │   │   └── layout/              # Layout components
│   │   ├── contexts/                # React contexts
│   │   ├── pages/                   # Page components
│   │   │   ├── admin/               # Admin pages
│   │   │   ├── doctor/              # Doctor pages
│   │   │   ├── patient/             # Patient pages
│   │   │   └── auth/                # Authentication pages
│   │   ├── services/                # API services
│   │   ├── App.js                   # Main app component
│   │   └── index.js                 # Entry point
│   ├── package.json                 # NPM dependencies
│   └── tailwind.config.js           # Tailwind configuration
│
├── docs/                            # Documentation
│   ├── backend/                     # Backend documentation
│   └── postman/                     # Postman collection
│
├── .gitignore                       # Git ignore rules
├── .env.example                     # Environment variables template
├── LICENSE                          # License file
└── README.md                        # This file
```

## 🔐 Environment Variables

### Backend (.env)

```properties
# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# Database
DB_URL=jdbc:postgresql://localhost:5432/healthmate
DB_USER=postgres
DB_PASSWORD=your_db_password

# Email
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

### Frontend (.env)

```properties
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_WS_URL=http://localhost:8080/ws
```

## 🧪 Testing

### Backend Tests

```bash
cd server

# Run all tests
./mvnw test

# Run specific test class
./mvnw test -Dtest=UserServiceTest

# Run with coverage
./mvnw clean test jacoco:report
```

### Frontend Tests

```bash
cd client

# Run tests
npm test

# Run with coverage
npm test -- --coverage
```

## 🐳 Docker Deployment

### Using Docker Compose

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

See [Setup Guide](docs/backend/SETUP.md#docker-setup-optional) for Docker configuration.

## 📊 Performance

- **Response Time**: < 100ms for cached queries
- **Throughput**: Handles 1000+ concurrent users
- **Database Optimization**: Indexed queries and connection pooling
- **Caching**: Redis-based caching reduces database load by 60-80%
- **WebSocket**: Real-time updates with minimal latency

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ BCrypt password hashing
- ✅ Role-based access control (RBAC)
- ✅ CORS configuration
- ✅ Input validation
- ✅ SQL injection prevention (JPA)
- ✅ OTP-based password reset
- ✅ Audit logging

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards

- Follow Java naming conventions
- Use Lombok annotations where appropriate
- Write meaningful commit messages
- Add comments for complex logic
- Write unit tests for new features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Skywalker690** - *Initial work* - [GitHub](https://github.com/Skywalker690)

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- React team for the powerful frontend library
- All contributors and supporters of this project

## 📞 Support

For support, email [sanjoksiby0@gmail.com](mailto:sanjoksiby0@gmail.com) or open an issue in the GitHub repository.


## 📈 Project Status

**Status**: Active Development

**Version**: 3.0.0-SNAPSHOT

**Last Updated**: November 2025

---

<div align="center">

**Built with ❤️ by the Skywalker690**

⭐ Star us on GitHub — it helps!

[Report Bug](https://github.com/Skywalker690/healthmate/issues) · 
[Request Feature](https://github.com/Skywalker690/healthmate/issues) · 
[Documentation](docs/backend/)

</div>
