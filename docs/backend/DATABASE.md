# Database Schema

## Overview

HealthMate Advanced uses PostgreSQL as its primary relational database, managed through Spring Data JPA with Hibernate ORM. The database follows a normalized structure with clear relationships between entities.

## Database Configuration

### Connection Settings (application.yml)

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/healthmate
    username: postgres
    password: tiger
    driver-class-name: org.postgresql.Driver

  jpa:
    hibernate:
      ddl-auto: update  # Auto-update schema
    show-sql: true      # Log SQL statements
    properties:
      hibernate:
        format_sql: true  # Format SQL for readability
```

### JPA Configuration

- **DDL Auto**: `update` - Automatically updates schema based on entity changes
- **Show SQL**: Enabled in development for debugging
- **Dialect**: PostgreSQL dialect (auto-detected)

## Entity Relationships

```
User (1) ─────── (0..1) Doctor
  │
  └─────────── (0..1) Patient

Doctor (1) ───── (*) DoctorSchedule
  │
  └──────────── (*) TimeSlot
  │
  └──────────── (*) Appointment

Patient (1) ──── (*) Appointment

Appointment (1) ─ (1) TimeSlot

User (1) ──────── (*) Notification

User (1) ──────── (*) OtpToken

System ─────────── (*) AuditLog
```

## Entity Schemas

### 1. User

Base entity for all user types (Admin, Doctor, Patient).

```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    role VARCHAR(20) NOT NULL,  -- ADMIN, DOCTOR, PATIENT
    gender VARCHAR(10),          -- MALE, FEMALE, OTHER
    date_of_birth DATE,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

**Java Entity:**
```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    private String firstName;
    private String lastName;
    private String phoneNumber;
    
    @Enumerated(EnumType.STRING)
    private USER_ROLE role;
    
    @Enumerated(EnumType.STRING)
    private GENDER gender;
    
    private LocalDate dateOfBirth;
    private String address;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    // Relationships
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Doctor doctor;
    
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Patient patient;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Notification> notifications;
}
```

### 2. Doctor

Extended profile for users with DOCTOR role.

```sql
CREATE TABLE doctors (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    experience_years INT,
    consultation_fee DECIMAL(10, 2),
    bio TEXT,
    education TEXT,
    rating DECIMAL(3, 2) DEFAULT 0.0,
    total_patients INT DEFAULT 0,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_doctors_specialization ON doctors(specialization);
CREATE INDEX idx_doctors_rating ON doctors(rating DESC);
```

**Java Entity:**
```java
@Entity
@Table(name = "doctors")
public class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User user;
    
    private String specialization;
    
    @Column(unique = true, nullable = false)
    private String licenseNumber;
    
    private Integer experienceYears;
    private BigDecimal consultationFee;
    private String bio;
    private String education;
    private BigDecimal rating;
    private Integer totalPatients;
    
    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL)
    private List<DoctorSchedule> schedules;
    
    @OneToMany(mappedBy = "doctor")
    private List<TimeSlot> timeSlots;
    
    @OneToMany(mappedBy = "doctor")
    private List<Appointment> appointments;
}
```

### 3. Patient

Extended profile for users with PATIENT role.

```sql
CREATE TABLE patients (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL,
    blood_group VARCHAR(10),
    medical_history TEXT,
    allergies TEXT,
    emergency_contact VARCHAR(20),
    emergency_contact_name VARCHAR(100),
    insurance_number VARCHAR(50),
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Java Entity:**
```java
@Entity
@Table(name = "patients")
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User user;
    
    private String bloodGroup;
    private String medicalHistory;
    private String allergies;
    private String emergencyContact;
    private String emergencyContactName;
    private String insuranceNumber;
    
    @OneToMany(mappedBy = "patient")
    private List<Appointment> appointments;
}
```

### 4. DoctorSchedule

Weekly schedule configuration for doctors.

```sql
CREATE TABLE doctor_schedules (
    id BIGSERIAL PRIMARY KEY,
    doctor_id BIGINT NOT NULL,
    day_of_week VARCHAR(20) NOT NULL,  -- MONDAY, TUESDAY, etc.
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    break_start_time TIME,
    break_end_time TIME,
    is_available BOOLEAN DEFAULT true,
    
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
    UNIQUE (doctor_id, day_of_week)
);

CREATE INDEX idx_schedule_doctor ON doctor_schedules(doctor_id);
CREATE INDEX idx_schedule_day ON doctor_schedules(day_of_week);
```

**Java Entity:**
```java
@Entity
@Table(name = "doctor_schedules")
public class DoctorSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;
    
    @Enumerated(EnumType.STRING)
    private DayOfWeek dayOfWeek;
    
    private LocalTime startTime;
    private LocalTime endTime;
    private LocalTime breakStartTime;
    private LocalTime breakEndTime;
    private Boolean isAvailable;
}
```

### 5. TimeSlot

Available appointment time slots for doctors.

```sql
CREATE TABLE time_slots (
    id BIGSERIAL PRIMARY KEY,
    doctor_id BIGINT NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE',  -- AVAILABLE, BOOKED, CANCELLED
    
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);

CREATE INDEX idx_timeslot_doctor ON time_slots(doctor_id);
CREATE INDEX idx_timeslot_start ON time_slots(start_time);
CREATE INDEX idx_timeslot_status ON time_slots(status);
CREATE INDEX idx_timeslot_doctor_date ON time_slots(doctor_id, start_time);
```

**Java Entity:**
```java
@Entity
@Table(name = "time_slots")
public class TimeSlot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;
    
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    
    @Enumerated(EnumType.STRING)
    private SlotStatus status;
    
    @OneToOne(mappedBy = "timeSlot")
    private Appointment appointment;
}
```

### 6. Appointment

Scheduled appointments between patients and doctors.

```sql
CREATE TABLE appointments (
    id BIGSERIAL PRIMARY KEY,
    appointment_code VARCHAR(50) UNIQUE NOT NULL,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    time_slot_id BIGINT UNIQUE,
    appointment_date TIMESTAMP NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'SCHEDULED',  -- SCHEDULED, COMPLETED, CANCELLED
    reason TEXT,
    notes TEXT,
    diagnosis TEXT,
    prescription TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
    FOREIGN KEY (time_slot_id) REFERENCES time_slots(id) ON DELETE SET NULL
);

CREATE INDEX idx_appointment_code ON appointments(appointment_code);
CREATE INDEX idx_appointment_patient ON appointments(patient_id);
CREATE INDEX idx_appointment_doctor ON appointments(doctor_id);
CREATE INDEX idx_appointment_date ON appointments(appointment_date);
CREATE INDEX idx_appointment_status ON appointments(status);
```

**Java Entity:**
```java
@Entity
@Table(name = "appointments")
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String appointmentCode;
    
    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;
    
    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;
    
    @OneToOne
    @JoinColumn(name = "time_slot_id", unique = true)
    private TimeSlot timeSlot;
    
    private LocalDateTime appointmentDate;
    
    @Enumerated(EnumType.STRING)
    private STATUS status;
    
    private String reason;
    private String notes;
    private String diagnosis;
    private String prescription;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
```

### 7. Notification

User notifications for various events.

```sql
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_notification_user ON notifications(user_id);
CREATE INDEX idx_notification_read ON notifications(is_read);
CREATE INDEX idx_notification_timestamp ON notifications(timestamp DESC);
```

**Java Entity:**
```java
@Entity
@Table(name = "notifications")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false)
    private String message;
    
    private Boolean isRead;
    
    @CreationTimestamp
    private LocalDateTime timestamp;
}
```

### 8. OtpToken

One-time password tokens for password reset and changes.

```sql
CREATE TABLE otp_tokens (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    purpose VARCHAR(50) NOT NULL,  -- PASSWORD_RESET, PASSWORD_CHANGE
    expiry_time TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_otp_email (email),
    INDEX idx_otp_purpose (purpose),
    INDEX idx_otp_expiry (expiry_time)
);
```

**Java Entity:**
```java
@Entity
@Table(name = "otp_tokens")
public class OtpToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String email;
    private String otp;
    
    @Enumerated(EnumType.STRING)
    private OtpPurpose purpose;
    
    private LocalDateTime expiryTime;
    private Boolean used;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
}
```

### 9. AuditLog

System audit trail for critical operations.

```sql
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id BIGINT,
    user_id BIGINT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    details TEXT,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_timestamp ON audit_logs(timestamp DESC);
```

**Java Entity:**
```java
@Entity
@Table(name = "audit_logs")
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String action;
    private String entityType;
    private Long entityId;
    private Long userId;
    
    @CreationTimestamp
    private LocalDateTime timestamp;
    
    private String details;
}
```

## Enumerations

### USER_ROLE
```java
public enum USER_ROLE {
    ADMIN,
    DOCTOR,
    PATIENT
}
```

### STATUS
```java
public enum STATUS {
    SCHEDULED,
    COMPLETED,
    CANCELLED
}
```

### SlotStatus
```java
public enum SlotStatus {
    AVAILABLE,
    BOOKED,
    CANCELLED
}
```

### GENDER
```java
public enum GENDER {
    MALE,
    FEMALE,
    OTHER
}
```

### OtpPurpose
```java
public enum OtpPurpose {
    PASSWORD_RESET,
    PASSWORD_CHANGE
}
```

## Key Relationships

1. **User → Doctor/Patient**: One-to-One relationship (inheritance through composition)
2. **Doctor → DoctorSchedule**: One-to-Many (weekly schedules)
3. **Doctor → TimeSlot**: One-to-Many (available slots)
4. **Doctor → Appointment**: One-to-Many
5. **Patient → Appointment**: One-to-Many
6. **TimeSlot → Appointment**: One-to-One
7. **User → Notification**: One-to-Many

## Cascade Operations

- **User deletion**: Cascades to Doctor/Patient, Notifications
- **Doctor deletion**: Cascades to Schedules, TimeSlots, Appointments
- **Patient deletion**: Cascades to Appointments

## Indexing Strategy

### Primary Indexes
- **Email**: Fast user lookup for authentication
- **Appointment Code**: Quick appointment retrieval
- **License Number**: Doctor verification

### Foreign Key Indexes
- All foreign key columns indexed for join performance

### Composite Indexes
- `(doctor_id, start_time)`: For time slot queries
- `(user_id, is_read)`: For unread notification queries

### Performance Indexes
- `appointment_date`: For date range queries
- `timestamp DESC`: For chronological ordering

## Sample Data Initialization

The system includes an optional `data.sql` file for seeding initial data:

```sql
-- Sample Admin User
INSERT INTO users (email, password, first_name, last_name, role, phone_number)
VALUES ('admin@healthmate.com', '$2a$10$...', 'Admin', 'User', 'ADMIN', '1234567890');

-- Sample Doctor
INSERT INTO users (email, password, first_name, last_name, role, phone_number, gender)
VALUES ('doctor@healthmate.com', '$2a$10$...', 'John', 'Smith', 'DOCTOR', '9876543210', 'MALE');

INSERT INTO doctors (user_id, specialization, license_number, experience_years, consultation_fee)
VALUES (2, 'Cardiology', 'LIC123456', 10, 100.00);
```

## Database Migrations

For production, consider using:

### Flyway Migration
```xml
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
```

### Liquibase
```xml
<dependency>
    <groupId>org.liquibase</groupId>
    <artifactId>liquibase-core</artifactId>
</dependency>
```

## Backup Strategy

### PostgreSQL Backup Commands

```bash
# Full backup
pg_dump -U postgres healthmate > healthmate_backup.sql

# Backup with compression
pg_dump -U postgres healthmate | gzip > healthmate_backup.sql.gz

# Restore
psql -U postgres healthmate < healthmate_backup.sql

# Automated daily backup (cron)
0 2 * * * pg_dump -U postgres healthmate | gzip > /backups/healthmate_$(date +\%Y\%m\%d).sql.gz
```

## Performance Optimization

### Query Optimization
1. Use appropriate indexes
2. Avoid N+1 queries with JOIN FETCH
3. Use pagination for large datasets
4. Cache frequently accessed data (Redis)

### Connection Pooling
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

## Database Monitoring

### Useful PostgreSQL Queries

```sql
-- Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check active connections
SELECT * FROM pg_stat_activity WHERE datname = 'healthmate';

-- Check slow queries
SELECT * FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10;

-- Check index usage
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

## Security Considerations

1. **Sensitive Data**: Password and OTP fields are sensitive
2. **Encryption**: Consider encrypting sensitive medical data
3. **Access Control**: Use database-level permissions
4. **Audit Trail**: Maintain comprehensive audit logs
5. **Data Retention**: Implement data retention policies
