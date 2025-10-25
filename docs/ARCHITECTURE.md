# Architecture Documentation

This document describes the system architecture, design patterns, and technical decisions for the HealthMate application.

## Table of Contents

- [System Overview](#system-overview)
- [Architecture Patterns](#architecture-patterns)
- [Technology Stack](#technology-stack)
- [System Components](#system-components)
- [Data Flow](#data-flow)
- [Security Architecture](#security-architecture)
- [Design Patterns](#design-patterns)
- [Scalability Considerations](#scalability-considerations)

## System Overview

HealthMate follows a **three-tier architecture** pattern with clear separation of concerns:

```
┌─────────────────────────────────────────────────────┐
│                  Presentation Layer                  │
│              (React Frontend - Port 3000)            │
│  - User Interface                                    │
│  - State Management (Context API)                    │
│  - Client-side Routing                               │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP/REST
                       │ (JSON)
┌──────────────────────▼──────────────────────────────┐
│                   Application Layer                  │
│            (Spring Boot Backend - Port 8080)         │
│  - REST Controllers                                  │
│  - Business Logic Services                           │
│  - Authentication & Authorization                    │
│  - DTO Mapping                                       │
└──────────────────────┬──────────────────────────────┘
                       │ JPA/Hibernate
                       │ (JDBC)
┌──────────────────────▼──────────────────────────────┐
│                     Data Layer                       │
│            (PostgreSQL Database - Port 5432)         │
│  - Relational Data Storage                           │
│  - ACID Transactions                                 │
│  - Data Integrity Constraints                        │
└─────────────────────────────────────────────────────┘
```

## Architecture Patterns

### 1. Model-View-Controller (MVC)

**Backend (Spring Boot)**:
- **Model**: JPA entities (`User`, `Doctor`, `Patient`, `Appointment`)
- **View**: JSON responses via REST API
- **Controller**: REST controllers handling HTTP requests

**Frontend (React)**:
- **Model**: API service layer and state management
- **View**: React components
- **Controller**: React components with hooks and event handlers

### 2. Repository Pattern

Data access is abstracted through JPA repositories:
```
Service Layer → Repository Interface → JPA Implementation → Database
```

### 3. Service Layer Pattern

Business logic is encapsulated in service classes:
- `UserService`: User management operations
- `AuthService`: Authentication and registration
- `AppointmentService`: Appointment scheduling logic
- `DoctorService`: Doctor-specific operations
- `PatientService`: Patient-specific operations

### 4. DTO (Data Transfer Object) Pattern

DTOs are used to:
- Decouple API contracts from domain models
- Control data exposure
- Optimize data transfer
- Provide validation

## Technology Stack

### Backend Architecture

```
┌─────────────────────────────────────────────────┐
│          Spring Boot Application                │
├─────────────────────────────────────────────────┤
│  Controllers (REST API Layer)                   │
│  ├── AuthController                             │
│  ├── UserController                             │
│  ├── DoctorController                           │
│  ├── PatientController                          │
│  └── AppointmentController                      │
├─────────────────────────────────────────────────┤
│  Security Layer                                 │
│  ├── JWT Filter                                 │
│  ├── Security Configuration                     │
│  └── User Details Service                       │
├─────────────────────────────────────────────────┤
│  Service Layer (Business Logic)                 │
│  ├── UserServiceImpl                            │
│  ├── AppointmentServiceImpl                     │
│  ├── DoctorServiceImpl                          │
│  └── PatientServiceImpl                         │
├─────────────────────────────────────────────────┤
│  Repository Layer (Data Access)                 │
│  ├── UserRepository                             │
│  ├── DoctorRepository                           │
│  ├── PatientRepository                          │
│  └── AppointmentRepository                      │
├─────────────────────────────────────────────────┤
│  Domain Layer                                   │
│  ├── Entities (User, Doctor, Patient, etc.)    │
│  ├── DTOs (UserDTO, AppointmentDTO, etc.)      │
│  └── Enums (USER_ROLE, STATUS, GENDER)         │
└─────────────────────────────────────────────────┘
```

### Frontend Architecture

```
┌─────────────────────────────────────────────────┐
│            React Application                    │
├─────────────────────────────────────────────────┤
│  Pages (Route Components)                       │
│  ├── Public: Landing, Login, Register          │
│  ├── Admin: Dashboard, Management Pages        │
│  ├── Doctor: Dashboard, Appointments, Profile  │
│  └── Patient: Dashboard, Booking, Profile      │
├─────────────────────────────────────────────────┤
│  Components                                     │
│  ├── Common: Modal, Spinner, ProtectedRoute    │
│  └── Feature-specific components               │
├─────────────────────────────────────────────────┤
│  Context Providers (State Management)           │
│  ├── AuthContext (User authentication)         │
│  └── ThemeContext (UI theming)                 │
├─────────────────────────────────────────────────┤
│  Services (API Layer)                           │
│  ├── api.js (Axios instance)                   │
│  ├── authService.js                            │
│  ├── userService.js                            │
│  ├── appointmentService.js                     │
│  ├── doctorService.js                          │
│  └── patientService.js                         │
└─────────────────────────────────────────────────┘
```

## System Components

### Backend Components

#### 1. Controllers
- Handle HTTP requests and responses
- Validate request data
- Delegate to service layer
- Return appropriate HTTP status codes

#### 2. Services
- Implement business logic
- Transaction management
- Data validation
- DTO mapping

#### 3. Repositories
- Data access operations
- Query methods
- CRUD operations

#### 4. Security Components
- **JWT Filter**: Validates JWT tokens on protected endpoints
- **Security Config**: Configures Spring Security
- **Password Encoder**: BCrypt password hashing

#### 5. Exception Handling
- Global exception handler
- Custom exception classes
- Standardized error responses

### Frontend Components

#### 1. Pages
- Route-level components
- Compose smaller components
- Handle page-specific logic

#### 2. Context Providers
- **AuthContext**: Manages authentication state
- **ThemeContext**: Manages UI theme preferences

#### 3. Services
- API communication layer
- Request/response handling
- Token management

#### 4. Protected Routes
- Authorization checks
- Role-based access control
- Redirect unauthorized users

## Data Flow

### Authentication Flow

```
1. User → Login Form
2. Frontend → POST /api/auth/login
3. Backend → Validate credentials
4. Backend → Generate JWT token
5. Backend → Return token + user data
6. Frontend → Store token (localStorage)
7. Frontend → Set Authorization header for subsequent requests
8. Frontend → Redirect to dashboard based on role
```

### Appointment Booking Flow

```
1. Patient → Select Doctor
2. Patient → Choose Date/Time
3. Frontend → POST /api/appointments/{patientId}/{doctorId}
4. Backend → Validate data
5. Backend → Check doctor availability
6. Backend → Generate unique appointment code
7. Backend → Create appointment record
8. Backend → Return appointment details
9. Frontend → Display confirmation
```

### Data Retrieval Flow

```
1. User → Request data (e.g., appointments)
2. Frontend → GET request with JWT token
3. Backend → Validate JWT token
4. Backend → Check user permissions
5. Backend → Query database
6. Backend → Map entities to DTOs
7. Backend → Return JSON response
8. Frontend → Update UI with data
```

## Security Architecture

### Authentication & Authorization

```
┌──────────────────────────────────────────────────┐
│                   Client Request                  │
└────────────────────┬─────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │   JWT Filter          │
         │  - Extract token      │
         │  - Validate token     │
         │  - Set authentication │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  Security Context     │
         │  - User details       │
         │  - Authorities/Roles  │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │    Controller         │
         │  - @PreAuthorize      │
         │  - Role checks        │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  Business Logic       │
         └───────────────────────┘
```

### Security Layers

1. **Transport Security**: HTTPS (in production)
2. **Authentication**: JWT tokens
3. **Authorization**: Role-based access control
4. **Input Validation**: Jakarta Validation
5. **Password Security**: BCrypt hashing
6. **CORS**: Configured for frontend origin

## Design Patterns

### 1. Dependency Injection

Spring Boot's IoC container manages all beans:
```java
@Service
public class UserServiceImpl implements IUserService {
    private final UserRepository userRepository;
    
    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
}
```

### 2. Factory Pattern

Entity creation through builders and factory methods:
```java
User user = new User();
user.setName("John Doe");
// ... set other properties
```

### 3. Singleton Pattern

Spring beans are singleton by default:
- Services
- Repositories
- Controllers

### 4. Strategy Pattern

Different authentication strategies for different roles

### 5. Observer Pattern

React's Context API implements observer pattern for state management

### 6. Facade Pattern

Service layer provides a simplified interface to complex subsystems

## Database Schema

### Entity Relationships

```
┌─────────────┐
│    User     │
│  (Base)     │
└──────┬──────┘
       │
       ├──────────────┐
       │              │
   ┌───▼───┐      ┌───▼────┐
   │Doctor │      │Patient │
   └───┬───┘      └───┬────┘
       │              │
       │              │
       └──────┬───────┘
              │
         ┌────▼────────┐
         │ Appointment │
         └─────────────┘
```

### Relationship Types

- **User ↔ Doctor**: One-to-One
- **User ↔ Patient**: One-to-One
- **Doctor ↔ Appointment**: One-to-Many
- **Patient ↔ Appointment**: One-to-Many

## Scalability Considerations

### Current Architecture

- Monolithic application
- Single database instance
- Stateless backend (JWT tokens)

### Future Enhancements

1. **Microservices**: Split into User, Appointment, and Notification services
2. **Caching**: Redis for session management and frequent queries
3. **Load Balancing**: Multiple backend instances
4. **Database Replication**: Read replicas for queries
5. **CDN**: Static asset delivery
6. **Message Queue**: Asynchronous processing (email notifications)
7. **API Gateway**: Centralized routing and rate limiting

### Horizontal Scaling

The stateless nature of JWT authentication allows:
- Multiple backend instances
- No session affinity required
- Easy deployment to cloud platforms

## API Design

### RESTful Principles

- Resource-based URLs
- HTTP verbs for operations
- Stateless communication
- JSON data format
- HATEOAS (planned for future)

### Response Structure

```json
{
  "statusCode": 200,
  "message": "Success message",
  "data": {
    // Response data
  }
}
```

### Error Handling

Consistent error responses:
```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## Configuration Management

### Environment-based Configuration

- Development: Local PostgreSQL, relaxed security
- Production: Cloud database, strict security, HTTPS

### Externalized Configuration

- Database credentials in `.env`
- JWT secrets in environment variables
- Feature flags (future)

## Monitoring and Logging

### Current Implementation

- Spring Boot Actuator endpoints
- Console logging with SLF4J
- Exception stack traces

### Future Enhancements

- Centralized logging (ELK stack)
- Application Performance Monitoring (APM)
- Metrics collection (Prometheus)
- Health checks and alerts

## Testing Strategy

### Backend Testing

- **Unit Tests**: Service layer logic
- **Integration Tests**: Repository operations
- **API Tests**: Controller endpoints

### Frontend Testing

- **Component Tests**: React Testing Library
- **Integration Tests**: User flows
- **E2E Tests**: Cypress (future)

## Deployment Architecture

### Development

```
Developer Machine
├── Backend: localhost:8080
├── Frontend: localhost:3000
└── Database: localhost:5432
```

### Production (Recommended)

```
Cloud Platform (AWS/Azure/GCP)
├── Frontend: Static hosting (S3, Netlify)
├── Backend: Container service (ECS, App Service)
├── Database: Managed PostgreSQL (RDS, Azure DB)
└── CDN: CloudFront, Azure CDN
```

## Conclusion

This architecture provides:
- ✅ Separation of concerns
- ✅ Maintainability
- ✅ Scalability
- ✅ Security
- ✅ Testability
- ✅ Clear data flow

For implementation details, see other documentation files.
