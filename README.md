# HealthMate 🏥

A comprehensive healthcare management system built with Spring Boot and React, designed to streamline medical appointments, patient records, and healthcare provider workflows.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.6-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://reactjs.org/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Documentation](#documentation)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

HealthMate is a modern, full-stack healthcare management platform that enables seamless interaction between patients, doctors, and administrators. The system provides role-based access control, appointment scheduling, profile management, and comprehensive administrative tools.

### Key Highlights

- **Role-Based Access Control**: Three user roles (Admin, Doctor, Patient) with specific permissions
- **Appointment Management**: Schedule, track, and manage medical appointments
- **User Management**: Complete CRUD operations for users, doctors, and patients
- **Secure Authentication**: JWT-based authentication and authorization
- **Responsive Design**: Mobile-first UI built with React and Tailwind CSS
- **RESTful API**: Well-documented REST API with comprehensive endpoints

## ✨ Features

### For Patients
- 👤 Register and manage personal profile
- 📅 Book appointments with doctors
- 📋 View appointment history
- 🔐 Secure login and password management
- 📱 Responsive interface for mobile and desktop

### For Doctors
- 👨‍⚕️ Manage professional profile (specialization, experience, availability)
- 📅 View and manage appointments
- 👥 Access patient information
- 📊 Track appointment statistics

### For Administrators
- 👥 Manage all users (Admin, Doctor, Patient)
- 🏥 Oversee all appointments
- 📊 System-wide analytics and reporting
- 🔧 Complete administrative control

## 🛠 Tech Stack

### Backend
- **Framework**: Spring Boot 3.5.6
- **Language**: Java 17
- **Database**: PostgreSQL
- **Security**: Spring Security + JWT (JJWT 0.12.5)
- **ORM**: Hibernate/JPA
- **Build Tool**: Maven
- **Validation**: Jakarta Validation

### Frontend
- **Framework**: React 19.1.1
- **Routing**: React Router DOM 7.9.3
- **Styling**: Tailwind CSS 3.4.17
- **HTTP Client**: Axios 1.12.2
- **Icons**: Heroicons 2.2.0
- **Animations**: Framer Motion 11.0.0

### DevOps
- **Containerization**: Docker
- **Version Control**: Git
- **CI/CD**: GitHub Actions (optional)

## 🚀 Getting Started

### Prerequisites

- **Java Development Kit (JDK)**: Version 17 or higher
- **Node.js**: Version 18 or higher
- **PostgreSQL**: Version 14 or higher
- **Maven**: Version 3.8 or higher (or use included Maven wrapper)
- **Git**: For version control

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Skywalker690/Healthmate.git
   cd Healthmate
   ```

2. **Set up the database**
   ```sql
   CREATE DATABASE healthmate;
   ```

3. **Configure backend environment**
   ```bash
   cd server/src/main/resources
   cp .env.example .env
   ```
   
   Edit `.env` with your database credentials:
   ```env
   JWT_SECRET=your-secret-key-min-256-bits
   DB_URL=jdbc:postgresql://localhost:5432/healthmate
   DB_USER=your_db_username
   DB_PASSWORD=your_db_password
   ```

4. **Start the backend server**
   ```bash
   cd server
   ./mvnw spring-boot:run
   ```
   
   The backend API will be available at `http://localhost:8080`

5. **Configure frontend environment**
   ```bash
   cd client
   cp .env.example .env
   ```
   
   Edit `.env` if needed:
   ```env
   REACT_APP_API_URL=http://localhost:8080
   ```

6. **Install frontend dependencies and start**
   ```bash
   npm install
   npm start
   ```
   
   The frontend will be available at `http://localhost:3000`

### Docker Deployment

```bash
# Build and run with Docker
cd server
docker build -t healthmate-backend .
docker run -p 8080:8080 healthmate-backend
```

For detailed installation instructions, see [docs/INSTALLATION.md](docs/INSTALLATION.md).

## 📚 Documentation

Comprehensive documentation is available in the `docs/` directory:

- **[Installation Guide](docs/INSTALLATION.md)** - Detailed setup instructions
- **[Architecture](docs/ARCHITECTURE.md)** - System design and architecture
- **[API Documentation](docs/API_DOCUMENTATION.md)** - Complete API reference
- **[Frontend Guide](docs/FRONTEND_GUIDE.md)** - Frontend structure and components
- **[Database Schema](docs/DATABASE.md)** - Database design and relationships
- **[Development Guide](docs/DEVELOPMENT.md)** - Development workflow and standards
- **[Deployment](docs/DEPLOYMENT.md)** - Production deployment guide
- **[Security](docs/SECURITY.md)** - Security implementation details
- **[Troubleshooting](docs/TROUBLESHOOTING.md)** - Common issues and solutions

## 📁 Project Structure

```
Healthmate/
├── client/                 # React frontend application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React Context providers
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service layer
│   │   └── App.js         # Main application component
│   └── package.json       # Frontend dependencies
│
├── server/                # Spring Boot backend application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/skywalker/backend/
│   │   │   │   ├── config/        # Configuration classes
│   │   │   │   ├── controller/    # REST controllers
│   │   │   │   ├── domain/        # Enums and constants
│   │   │   │   ├── dto/           # Data Transfer Objects
│   │   │   │   ├── exception/     # Exception handling
│   │   │   │   ├── model/         # JPA entities
│   │   │   │   ├── repository/    # Data repositories
│   │   │   │   ├── security/      # Security configuration
│   │   │   │   └── service/       # Business logic
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/          # Test classes
│   ├── Documentation/     # API contracts and Postman collection
│   ├── Dockerfile         # Docker configuration
│   └── pom.xml           # Maven dependencies
│
├── docs/                  # Project documentation
├── LICENSE               # MIT License
└── README.md            # This file
```

## 🔌 API Documentation

The REST API provides comprehensive endpoints for managing users, appointments, and authentication.

**Base URL**: `http://localhost:8080/api`

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - User login

### Users
- `GET /users` - Get all users (Admin only)
- `GET /users/{id}` - Get user by ID
- `GET /users/me` - Get current user
- `PUT /users/me` - Update current user
- `PUT /users/me/password` - Change password
- `DELETE /users/{id}` - Delete user (Admin only)

### Appointments
- `GET /appointments` - Get all appointments (Admin only)
- `GET /appointments/{id}` - Get appointment by ID
- `POST /appointments/{patientId}/{doctorId}` - Create appointment
- `PUT /appointments/{id}/status` - Update appointment status
- `DELETE /appointments/{id}` - Delete appointment

For complete API documentation, see [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) or the Postman collection in `server/Documentation/`.

## 🔒 Security

- **Authentication**: JWT-based token authentication
- **Authorization**: Role-based access control (RBAC)
- **Password**: BCrypt password hashing
- **CORS**: Configurable CORS policy
- **Validation**: Input validation on all endpoints

For detailed security information, see [docs/SECURITY.md](docs/SECURITY.md).

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) for coding standards and best practices.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Skywalker690** - *Initial work* - [GitHub](https://github.com/Skywalker690)

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- React team for the frontend library
- All contributors who have helped improve this project

## 📞 Support

For support, please open an issue in the GitHub repository or contact the maintainers.

---

**Made with ❤️ by Skywalker690**
