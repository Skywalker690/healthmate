# Database Documentation

Complete database schema and design documentation for HealthMate.

## Table of Contents

- [Overview](#overview)
- [Database Schema](#database-schema)
- [Entity Relationships](#entity-relationships)
- [Table Definitions](#table-definitions)
- [Indexes and Constraints](#indexes-and-constraints)
- [Data Types and Enums](#data-types-and-enums)
- [Migrations](#migrations)
- [Queries and Performance](#queries-and-performance)
- [Backup and Recovery](#backup-and-recovery)

## Overview

HealthMate uses **PostgreSQL** as its relational database management system. The database is designed to support:

- User management with role-based access
- Doctor and patient profiles
- Appointment scheduling and tracking
- Data integrity and referential constraints

### Database Specifications

- **DBMS**: PostgreSQL 14+
- **ORM**: Hibernate/JPA
- **Connection Pool**: HikariCP (Spring Boot default)
- **DDL Strategy**: `update` (development), `validate` (production)

## Database Schema

### Entity Relationship Diagram (ERD)

```
┌─────────────────────────┐
│         users           │
│─────────────────────────│
│ PK  id                  │
│     name                │
│ UK  email               │
│     password            │
│ UK  phone_number        │
│     role                │
│     gender              │
│     date_of_birth       │
│     address             │
│     created_date        │
│     updated_date        │
└────────┬────────────────┘
         │
         │ 1:1
         ├──────────────────┐
         │                  │
    ┌────▼────────┐    ┌────▼─────────┐
    │  doctors    │    │  patients    │
    │─────────────│    │──────────────│
    │ PK user_id  │    │ PK user_id   │
    │    experience│    │ created_at  │
    │    available│    │ updated_at  │
    │    hours    │    │             │
    │    specializ│    │             │
    │    ation    │    │             │
    │    created_at│   │             │
    │    updated_at│   │             │
    └────┬────────┘    └────┬─────────┘
         │                  │
         │ 1:N              │ 1:N
         │                  │
         └────────┬─────────┘
                  │
            ┌─────▼──────────────┐
            │   appointments     │
            │────────────────────│
            │ PK id              │
            │ FK doctor_id       │
            │ FK patient_id      │
            │ UK appointment_code│
            │    appointment_    │
            │    date_time       │
            │    status          │
            │    notes           │
            │    created_at      │
            │    updated_at      │
            └────────────────────┘
```

## Entity Relationships

### Relationship Summary

| Parent | Child | Type | Description |
|--------|-------|------|-------------|
| User | Doctor | One-to-One | A user with ROLE_DOCTOR has one doctor profile |
| User | Patient | One-to-One | A user with ROLE_PATIENT has one patient profile |
| Doctor | Appointment | One-to-Many | A doctor can have multiple appointments |
| Patient | Appointment | One-to-Many | A patient can have multiple appointments |

### Cascade Rules

- **User → Doctor/Patient**: CASCADE ALL (delete user deletes profile)
- **Doctor → Appointment**: CASCADE ALL (delete doctor deletes appointments)
- **Patient → Appointment**: CASCADE ALL (delete patient deletes appointments)

## Table Definitions

### users

Primary table storing all user information.

```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'ROLE_PATIENT',
    gender VARCHAR(20) NOT NULL DEFAULT 'MALE',
    date_of_birth DATE NOT NULL,
    address TEXT NOT NULL,
    created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

**Columns**:

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | BIGINT | NO | AUTO | Primary key |
| name | VARCHAR(255) | NO | - | User's full name |
| email | VARCHAR(255) | NO | - | User's email (unique) |
| password | VARCHAR(255) | NO | - | BCrypt hashed password |
| phone_number | VARCHAR(255) | NO | - | Phone number (unique) |
| role | VARCHAR(50) | NO | ROLE_PATIENT | User role enum |
| gender | VARCHAR(20) | NO | MALE | Gender enum |
| date_of_birth | DATE | NO | - | Birth date |
| address | TEXT | NO | - | Full address |
| created_date | TIMESTAMP | NO | NOW() | Record creation timestamp |
| updated_date | TIMESTAMP | NO | NOW() | Last update timestamp |

**Constraints**:
- `PRIMARY KEY (id)`
- `UNIQUE (email)`
- `UNIQUE (phone_number)`
- `CHECK (date_of_birth < CURRENT_DATE)` - Date of birth must be in the past
- `CHECK (role IN ('ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_PATIENT'))`

---

### doctors

Extended profile for users with ROLE_DOCTOR.

```sql
CREATE TABLE doctors (
    user_id BIGINT PRIMARY KEY,
    experience INTEGER NOT NULL,
    available_hours TEXT NOT NULL,
    specialization VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Columns**:

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| user_id | BIGINT | NO | Foreign key to users.id (also primary key) |
| experience | INTEGER | NO | Years of experience |
| available_hours | TEXT | NO | Available hours description |
| specialization | VARCHAR(255) | NO | Medical specialization |
| created_at | TIMESTAMP | NO | Record creation timestamp |
| updated_at | TIMESTAMP | NO | Last update timestamp |

**Constraints**:
- `PRIMARY KEY (user_id)`
- `FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE`
- `CHECK (experience >= 0)` - Experience must be non-negative

---

### patients

Extended profile for users with ROLE_PATIENT.

```sql
CREATE TABLE patients (
    user_id BIGINT PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Columns**:

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| user_id | BIGINT | NO | Foreign key to users.id (also primary key) |
| created_at | TIMESTAMP | NO | Record creation timestamp |
| updated_at | TIMESTAMP | NO | Last update timestamp |

**Constraints**:
- `PRIMARY KEY (user_id)`
- `FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE`

**Note**: Patient table currently stores minimal data. Future enhancements may include medical history, allergies, insurance information, etc.

---

### appointments

Tracks all medical appointments between patients and doctors.

```sql
CREATE TABLE appointments (
    id BIGSERIAL PRIMARY KEY,
    doctor_id BIGINT NOT NULL,
    patient_id BIGINT NOT NULL,
    appointment_code VARCHAR(255) UNIQUE NOT NULL,
    appointment_date_time TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'SCHEDULED',
    notes TEXT DEFAULT 'No notes',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES doctors(user_id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES patients(user_id) ON DELETE CASCADE
);
```

**Columns**:

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | BIGINT | NO | AUTO | Primary key |
| doctor_id | BIGINT | NO | - | Foreign key to doctors |
| patient_id | BIGINT | NO | - | Foreign key to patients |
| appointment_code | VARCHAR(255) | NO | - | Unique appointment code |
| appointment_date_time | TIMESTAMP | NO | - | Appointment date and time |
| status | VARCHAR(50) | NO | SCHEDULED | Appointment status |
| notes | TEXT | YES | No notes | Additional notes |
| created_at | TIMESTAMP | NO | NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | NO | NOW() | Last update timestamp |

**Constraints**:
- `PRIMARY KEY (id)`
- `UNIQUE (appointment_code)`
- `FOREIGN KEY (doctor_id) REFERENCES doctors(user_id) ON DELETE CASCADE`
- `FOREIGN KEY (patient_id) REFERENCES patients(user_id) ON DELETE CASCADE`
- `CHECK (appointment_date_time > created_at)` - Appointment must be in the future
- `CHECK (status IN ('SCHEDULED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED', 'NO_SHOW'))`

## Indexes and Constraints

### Indexes

**Automatically created indexes**:
- Primary keys: Clustered indexes on id columns
- Unique constraints: Indexes on unique columns (email, phone_number, appointment_code)

**Recommended additional indexes** (for production):

```sql
-- Index for faster user lookups by role
CREATE INDEX idx_users_role ON users(role);

-- Index for appointment queries by doctor
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);

-- Index for appointment queries by patient
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);

-- Index for appointment queries by status
CREATE INDEX idx_appointments_status ON appointments(status);

-- Index for appointment queries by date
CREATE INDEX idx_appointments_date_time ON appointments(appointment_date_time);

-- Composite index for common queries
CREATE INDEX idx_appointments_doctor_status ON appointments(doctor_id, status);
```

### Foreign Key Constraints

All foreign keys use `ON DELETE CASCADE` to maintain referential integrity:

- Deleting a user cascades to delete their doctor/patient profile
- Deleting a doctor/patient cascades to delete their appointments

## Data Types and Enums

### Enum Values

#### USER_ROLE

```java
public enum USER_ROLE {
    ROLE_ADMIN,
    ROLE_DOCTOR,
    ROLE_PATIENT
}
```

Stored as: `VARCHAR(50)`

#### GENDER

```java
public enum GENDER {
    MALE,
    FEMALE,
    OTHER
}
```

Stored as: `VARCHAR(20)`

#### STATUS

```java
public enum STATUS {
    SCHEDULED,
    COMPLETED,
    CANCELLED,
    RESCHEDULED,
    NO_SHOW
}
```

Stored as: `VARCHAR(50)`

## Migrations

### Schema Management

**Development**: 
- `spring.jpa.hibernate.ddl-auto=update`
- Hibernate automatically updates schema

**Production**:
- `spring.jpa.hibernate.ddl-auto=validate`
- Manual migrations recommended

### Using Flyway (Recommended for Production)

Add to `pom.xml`:
```xml
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
```

Migration file: `src/main/resources/db/migration/V1__Initial_schema.sql`

### Sample Initial Migration

```sql
-- V1__Initial_schema.sql

-- Create users table
CREATE TABLE users (
    -- ... (see table definition above)
);

-- Create doctors table
CREATE TABLE doctors (
    -- ... (see table definition above)
);

-- Create patients table
CREATE TABLE patients (
    -- ... (see table definition above)
);

-- Create appointments table
CREATE TABLE appointments (
    -- ... (see table definition above)
);

-- Create indexes
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_status ON appointments(status);
```

## Queries and Performance

### Common Queries

**Get all doctors with their user info**:
```sql
SELECT u.*, d.*
FROM users u
INNER JOIN doctors d ON u.id = d.user_id
WHERE u.role = 'ROLE_DOCTOR';
```

**Get appointments for a specific doctor**:
```sql
SELECT a.*, 
       u_patient.name as patient_name,
       u_patient.email as patient_email
FROM appointments a
INNER JOIN patients p ON a.patient_id = p.user_id
INNER JOIN users u_patient ON p.user_id = u_patient.id
WHERE a.doctor_id = ?
ORDER BY a.appointment_date_time DESC;
```

**Get upcoming appointments**:
```sql
SELECT a.*
FROM appointments a
WHERE a.appointment_date_time > CURRENT_TIMESTAMP
  AND a.status = 'SCHEDULED'
ORDER BY a.appointment_date_time ASC;
```

### Query Optimization Tips

1. **Use indexes** on frequently queried columns
2. **Avoid SELECT *** in production; specify needed columns
3. **Use LIMIT** for pagination
4. **Use prepared statements** to prevent SQL injection (JPA handles this)
5. **Monitor slow queries** with PostgreSQL logs

### Connection Pooling

Spring Boot uses HikariCP with default settings:
- **maximum-pool-size**: 10
- **minimum-idle**: 10
- **connection-timeout**: 30000ms

Adjust in `application.properties`:
```properties
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5
```

## Backup and Recovery

### Backup Strategies

#### Manual Backup

```bash
# Full database backup
pg_dump -U healthmate_user -h localhost healthmate > backup.sql

# Backup with compression
pg_dump -U healthmate_user -h localhost healthmate | gzip > backup.sql.gz

# Backup specific tables
pg_dump -U healthmate_user -h localhost -t users -t appointments healthmate > backup.sql
```

#### Automated Backup Script

```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="healthmate"
DB_USER="healthmate_user"

pg_dump -U $DB_USER $DB_NAME | gzip > $BACKUP_DIR/healthmate_$DATE.sql.gz

# Keep only last 7 days of backups
find $BACKUP_DIR -name "healthmate_*.sql.gz" -mtime +7 -delete
```

Add to crontab for daily backups:
```bash
0 2 * * * /path/to/backup.sh
```

### Restore

```bash
# Restore from backup
psql -U healthmate_user -h localhost healthmate < backup.sql

# Restore from compressed backup
gunzip < backup.sql.gz | psql -U healthmate_user -h localhost healthmate
```

### Cloud Backups

**For production**, use managed PostgreSQL services:
- **AWS RDS**: Automated backups with point-in-time recovery
- **Azure Database**: Automated backups with geo-redundancy
- **Google Cloud SQL**: Automated backups with on-demand snapshots

## Security Best Practices

1. **Never store passwords in plain text** - Use BCrypt (implemented)
2. **Use parameterized queries** - JPA handles this
3. **Limit database user permissions** - Grant only necessary privileges
4. **Enable SSL/TLS** for database connections in production
5. **Regular security audits** and penetration testing
6. **Monitor for suspicious queries** and access patterns

## Maintenance

### Regular Maintenance Tasks

**Analyze tables** (update statistics):
```sql
ANALYZE users;
ANALYZE appointments;
```

**Vacuum tables** (reclaim storage):
```sql
VACUUM FULL users;
VACUUM FULL appointments;
```

**Check table sizes**:
```sql
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Monitoring

Monitor these metrics:
- Database size
- Connection pool usage
- Slow queries
- Lock contention
- Replication lag (if using replicas)

## Future Enhancements

Potential database improvements:

1. **Add full-text search** for doctors by specialization
2. **Implement soft deletes** instead of hard deletes
3. **Add audit tables** for change tracking
4. **Implement read replicas** for scaling
5. **Add caching layer** (Redis) for frequent queries
6. **Partition large tables** by date
7. **Add medical records** and file storage references

## Conclusion

This database design provides:
- ✅ Data integrity with foreign keys
- ✅ Clear relationships between entities
- ✅ Scalability for future growth
- ✅ Security with constraints
- ✅ Performance with proper indexing

For implementation details, see [ARCHITECTURE.md](ARCHITECTURE.md) and [API_DOCUMENTATION.md](API_DOCUMENTATION.md).
