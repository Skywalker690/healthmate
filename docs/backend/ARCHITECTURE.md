# Backend Architecture

## Overview

HealthMate Advanced is a comprehensive healthcare management system built with Spring Boot 3.5.6 and Java 17. The application follows a layered architecture pattern with clear separation of concerns.

## Technology Stack

### Core Framework
- **Spring Boot**: 3.5.6
- **Java**: 17
- **Build Tool**: Maven

### Dependencies
- **Spring Boot Starter Web**: RESTful API development
- **Spring Boot Starter Data JPA**: Data persistence with Hibernate
- **Spring Boot Starter Security**: Authentication and authorization
- **Spring Boot Starter Validation**: Input validation
- **Spring Boot Starter WebSocket**: Real-time communication
- **Spring Boot Starter Cache**: Caching abstraction
- **Spring Boot Starter Data Redis**: Redis integration
- **Spring Boot Starter Mail**: Email functionality

### Database
- **PostgreSQL**: Primary relational database
- **Hibernate**: ORM framework with automatic DDL updates

### Security
- **Spring Security**: Core security framework
- **JJWT (0.12.5)**: JWT token generation and validation
  - `jjwt-api`: JWT API
  - `jjwt-impl`: JWT implementation
  - `jjwt-jackson`: JSON serialization/deserialization

### Caching
- **Redis**: In-memory data store for caching
- **Spring Cache**: Caching abstraction layer

### WebSocket
- **Spring WebSocket**: Real-time bidirectional communication
- **STOMP Protocol**: Simple Text Oriented Messaging Protocol
- **SockJS**: WebSocket fallback support

### Additional Tools
- **Lombok**: Reduce boilerplate code
- **Spring Dotenv**: Environment variable management
- **Spring Boot DevTools**: Development productivity

## Architecture Layers

### 1. Presentation Layer (`controller` package)
Handles HTTP requests and responses, serving as the entry point for API calls.

**Controllers:**
- `AuthController`: Authentication endpoints (register, login, password reset)
- `UserController`: User management operations
- `DoctorController`: Doctor-specific operations and schedule management
- `PatientController`: Patient-specific operations
- `AppointmentController`: Appointment CRUD and status management
- `DashboardController`: Dashboard statistics and analytics
- `NotificationController`: Notification management and SSE streaming

### 2. Service Layer (`service` package)
Contains business logic and orchestrates operations between controllers and repositories.

**Key Services:**
- `AuthService`: Authentication and authorization logic
- `UserService`: User management business logic
- `DoctorService`: Doctor operations and specialty management
- `PatientService`: Patient-specific operations
- `AppointmentService`: Appointment scheduling and management
- `DoctorScheduleService`: Doctor schedule configuration
- `TimeSlotService`: Time slot generation and availability
- `NotificationService`: Real-time notification handling
- `DashboardService`: Dashboard data aggregation
- `EmailService`: Email notification sending
- `OtpService`: OTP generation and verification
- `AuditLogService`: Audit trail management

### 3. Data Access Layer (`repository` package)
Spring Data JPA repositories for database operations.

**Repositories:**
- `UserRepository`
- `DoctorRepository`
- `PatientRepository`
- `AppointmentRepository`
- `DoctorScheduleRepository`
- `TimeSlotRepository`
- `NotificationRepository`
- `OtpTokenRepository`
- `AuditLogRepository`

### 4. Domain Model (`model` package)
Entity classes representing database tables.

**Entities:**
- `User`: Base user entity with roles (ADMIN, DOCTOR, PATIENT)
- `Doctor`: Doctor profile with specialization
- `Patient`: Patient profile with medical history
- `Appointment`: Appointment details and status
- `DoctorSchedule`: Doctor working hours configuration
- `TimeSlot`: Available appointment time slots
- `Notification`: User notifications
- `OtpToken`: One-time password tokens
- `AuditLog`: System audit trail

### 5. Data Transfer Objects (`dto` package)
DTOs for API request/response handling.

**Key DTOs:**
- `RegisterRequest`, `LoginRequest`: Authentication
- `UserDTO`, `DoctorDTO`, `PatientDTO`: User data
- `AppointmentDTO`: Appointment information
- `DoctorScheduleDTO`, `TimeSlotDTO`: Scheduling
- `NotificationDTO`: Notification data
- `DashboardStatsDTO`, `TopDoctorDTO`: Dashboard data
- `Response`: Generic API response wrapper
- `PasswordResetRequest`, `OtpVerificationRequest`: Password management

### 6. Security Layer (`security` package)
Authentication and authorization components.

**Components:**
- `SecurityConfig`: Spring Security configuration
- `JwtTokenProvider`: JWT token generation and validation
- `JwtAuthenticationFilter`: JWT token filter for requests
- `JwtAuthEntryPoint`: Unauthorized request handler
- `CustomUserDetailsService`: User details loading
- `CustomUserDetails`: User details implementation
- `Utils`: Security utility methods

### 7. Configuration (`config` package)
Application configuration classes.

**Configurations:**
- `SecurityConfig`: Security and CORS configuration
- `WebSocketConfig`: WebSocket and STOMP configuration
- `RedisConfig`: Redis cache configuration
- `CorsConfig`: Cross-Origin Resource Sharing

### 8. Exception Handling (`exception` package)
Custom exceptions and global error handling.

**Components:**
- `OurException`: Custom application exception
- `RestExceptionHandler`: Global exception handler

### 9. Domain Enums (`domain` package)
Enumeration types for domain logic.

**Enums:**
- `USER_ROLE`: ADMIN, DOCTOR, PATIENT
- `STATUS`: SCHEDULED, COMPLETED, CANCELLED
- `GENDER`: MALE, FEMALE, OTHER
- `SlotStatus`: AVAILABLE, BOOKED, CANCELLED
- `OtpPurpose`: PASSWORD_RESET, PASSWORD_CHANGE

## Design Patterns

### 1. Layered Architecture
- Clear separation between presentation, business, and data layers
- Each layer depends only on the layer below it

### 2. Repository Pattern
- Abstraction over data access logic
- Spring Data JPA repositories

### 3. Service Layer Pattern
- Business logic encapsulation
- Transaction management

### 4. DTO Pattern
- Data transfer between layers
- Decoupling domain models from API contracts

### 5. Dependency Injection
- Constructor-based injection using Lombok's `@RequiredArgsConstructor`
- Promotes loose coupling and testability

### 6. Builder Pattern
- Used in JWT token creation
- Entity construction

### 7. Factory Pattern
- User role-based object creation
- Response object creation

## Data Flow

### Typical Request Flow
1. **HTTP Request** arrives at a Controller
2. **JWT Filter** validates authentication token
3. **Controller** delegates to appropriate Service
4. **Service** applies business logic
5. **Repository** performs database operations
6. **Service** transforms entities to DTOs
7. **Controller** returns Response object
8. **Exception Handler** catches and formats errors

### WebSocket Flow
1. Client connects to `/ws` endpoint
2. STOMP protocol established
3. Client subscribes to `/queue/notifications/{userId}`
4. Server publishes notifications via `SimpMessagingTemplate`
5. Client receives real-time updates

### Caching Flow
1. Service method annotated with `@Cacheable`
2. Redis checks for cached data
3. If cache miss, database query executes
4. Result cached in Redis with TTL
5. Subsequent requests served from cache

## Security Architecture

### Authentication Flow
1. User sends credentials to `/api/auth/login`
2. Service validates credentials
3. JWT token generated with user details and roles
4. Token returned to client
5. Client includes token in `Authorization` header for subsequent requests
6. `JwtAuthenticationFilter` validates token on each request
7. Security context populated with user details

### Authorization
- Role-based access control (RBAC)
- Method-level security with `@PreAuthorize`
- Three roles: ADMIN, DOCTOR, PATIENT

### Password Security
- BCrypt password encoding
- OTP-based password reset
- Email-based verification

## Real-Time Communication

### WebSocket Configuration
- **Endpoint**: `/ws` with SockJS fallback
- **Message Broker**: Simple in-memory broker
- **Destinations**: `/topic`, `/queue`
- **Application Prefix**: `/app`

### Notification Delivery
1. **Database Storage**: Notifications saved in database
2. **WebSocket Push**: Real-time delivery via STOMP
3. **SSE Alternative**: Server-Sent Events for fallback
4. **Persistence**: Notifications queryable via REST API

## Caching Strategy

### Cache Configuration
- **Default TTL**: 10 minutes
- **Custom TTLs**:
  - Doctors: 30 minutes (relatively static)
  - Dashboard Stats: 5 minutes (frequently updated)
  - Time Slots: 2 minutes (highly dynamic)

### Cache Names
- `doctors`: Doctor directory
- `dashboardStats`: Dashboard statistics
- `timeSlots`: Available time slots

### Cache Eviction
- Automatic TTL-based expiration
- Manual eviction on data updates
- Cache-aside pattern

## Email Service

### Configuration
- **Provider**: Gmail SMTP
- **Port**: 587 (TLS)
- **Authentication**: Required
- **Usage**: OTP delivery, appointment notifications

## Database Strategy

### ORM Configuration
- **DDL Auto**: Update (automatic schema updates)
- **Show SQL**: Enabled in development
- **SQL Formatting**: Enabled for readability

### Transaction Management
- `@Transactional` annotations on service methods
- ACID compliance
- Rollback on exceptions

## Scalability Considerations

### Horizontal Scaling
- Stateless REST API design
- JWT tokens (no session state)
- Redis for shared cache
- PostgreSQL connection pooling

### Performance Optimization
- Redis caching for frequently accessed data
- Pagination for large datasets
- Lazy loading for entity relationships
- Query optimization with JPA

### Monitoring & Observability
- Spring Boot Actuator endpoints
- Audit logging for critical operations
- Exception tracking

## Development Tools

### Hot Reload
- Spring Boot DevTools for automatic restart
- Fast application context reload

### Environment Management
- `.env` file support via spring-dotenv
- Environment-specific configurations
- Secure credential management

## Future Enhancements

### Potential Improvements
1. **Microservices**: Break into smaller services
2. **Message Queue**: RabbitMQ/Kafka for async processing
3. **API Gateway**: Centralized routing and rate limiting
4. **Service Discovery**: Eureka or Consul
5. **Distributed Tracing**: Sleuth and Zipkin
6. **Containerization**: Docker and Kubernetes
7. **API Documentation**: Swagger/OpenAPI
8. **Load Balancing**: Nginx or cloud load balancer
9. **Database Replication**: Read replicas for scalability
10. **Circuit Breaker**: Resilience4j for fault tolerance
