# API Documentation

Complete REST API reference for the HealthMate application.

## Table of Contents

- [Overview](#overview)
- [Base URL](#base-url)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Endpoints](#endpoints)
  - [Authentication](#authentication-endpoints)
  - [Users](#user-endpoints)
  - [Doctors](#doctor-endpoints)
  - [Patients](#patient-endpoints)
  - [Appointments](#appointment-endpoints)

## Overview

The HealthMate API is a RESTful API that uses JSON for request and response bodies. All endpoints (except authentication) require JWT-based authentication.

### API Characteristics

- **Protocol**: HTTP/HTTPS
- **Data Format**: JSON
- **Authentication**: JWT Bearer Token
- **Authorization**: Role-based access control (RBAC)

## Base URL

```
Development: http://localhost:8080/api
Production: https://your-domain.com/api
```

## Authentication

### JWT Token Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Token Lifecycle

- **Expiration**: Tokens expire after a configured duration
- **Refresh**: Re-authenticate to get a new token
- **Storage**: Store securely (not in localStorage for production apps)

## Error Handling

### Standard Error Response

```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Detailed error description"
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid request data |
| 401 | Unauthorized - Missing or invalid authentication |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 500 | Internal Server Error - Server error |

## Rate Limiting

Currently, no rate limiting is implemented. For production deployment, consider implementing rate limiting at the API gateway or application level.

---

## Endpoints

## Authentication Endpoints

### Register User

Register a new user account.

**Endpoint**: `POST /api/auth/register`

**Authentication**: None required

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "SecurePassword123!",
  "phoneNumber": "1234567890",
  "role": "ROLE_PATIENT",
  "gender": "MALE",
  "dateOfBirth": "1990-01-15",
  "address": "123 Main Street, City, State 12345"
}
```

**Request Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | String | Yes | Full name |
| email | String | Yes | Valid email address (unique) |
| password | String | Yes | Password (min 8 characters recommended) |
| phoneNumber | String | Yes | Phone number (unique) |
| role | Enum | Yes | ROLE_ADMIN, ROLE_DOCTOR, or ROLE_PATIENT |
| gender | Enum | Yes | MALE, FEMALE, or OTHER |
| dateOfBirth | Date | Yes | Date in YYYY-MM-DD format (must be in the past) |
| address | String | Yes | Full address |

**Success Response** (200 OK):
```json
{
  "statusCode": 200,
  "message": "User registered successfully"
}
```

**Error Responses**:
- 400: Invalid data or validation failure
- 409: Email or phone number already exists

---

### Login

Authenticate user and receive JWT token.

**Endpoint**: `POST /api/auth/login`

**Authentication**: None required

**Request Body**:
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123!"
}
```

**Request Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | String | Yes | User's email address |
| password | String | Yes | User's password |

**Success Response** (200 OK):
```json
{
  "statusCode": 200,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "ROLE_PATIENT",
  "expiresIn": "86400000"
}
```

**Error Responses**:
- 401: Invalid credentials
- 400: Missing required fields

---

## User Endpoints

### Get All Users

Retrieve all users in the system (Admin only).

**Endpoint**: `GET /api/users`

**Authentication**: Required (Bearer Token)

**Authorization**: ROLE_ADMIN only

**Success Response** (200 OK):
```json
{
  "statusCode": 200,
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phoneNumber": "1234567890",
      "role": "ROLE_PATIENT",
      "gender": "MALE",
      "dateOfBirth": "1990-01-15",
      "address": "123 Main Street",
      "createdDate": "2025-01-01T10:00:00",
      "updatedDate": "2025-01-01T10:00:00"
    }
  ]
}
```

---

### Get User by ID

Retrieve a specific user by ID.

**Endpoint**: `GET /api/users/{id}`

**Authentication**: Required (Bearer Token)

**Authorization**: Own data or ROLE_ADMIN

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | Long | User ID |

**Success Response** (200 OK):
```json
{
  "statusCode": 200,
  "message": "User retrieved successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "1234567890",
    "role": "ROLE_PATIENT",
    "gender": "MALE",
    "dateOfBirth": "1990-01-15",
    "address": "123 Main Street",
    "createdDate": "2025-01-01T10:00:00",
    "updatedDate": "2025-01-01T10:00:00"
  }
}
```

**Error Responses**:
- 404: User not found
- 403: Insufficient permissions

---

### Get Current User

Retrieve the authenticated user's profile.

**Endpoint**: `GET /api/users/me`

**Authentication**: Required (Bearer Token)

**Success Response** (200 OK):
```json
{
  "statusCode": 200,
  "message": "User retrieved successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "1234567890",
    "role": "ROLE_PATIENT",
    "gender": "MALE",
    "dateOfBirth": "1990-01-15",
    "address": "123 Main Street"
  }
}
```

---

### Update Current User

Update the authenticated user's profile.

**Endpoint**: `PUT /api/users/me`

**Authentication**: Required (Bearer Token)

**Request Body**:
```json
{
  "name": "John Updated Doe",
  "phoneNumber": "9876543210",
  "address": "456 New Street, City"
}
```

**Success Response** (200 OK):
```json
{
  "statusCode": 200,
  "message": "User updated successfully",
  "data": {
    "id": 1,
    "name": "John Updated Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "9876543210",
    "address": "456 New Street, City"
  }
}
```

---

### Update User by ID (Admin)

Update any user's profile (Admin only).

**Endpoint**: `PUT /api/users/{id}`

**Authentication**: Required (Bearer Token)

**Authorization**: ROLE_ADMIN only

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | Long | User ID |

**Request Body**: Same as Update Current User

---

### Change Password

Change the authenticated user's password.

**Endpoint**: `PUT /api/users/me/password`

**Authentication**: Required (Bearer Token)

**Request Body**:
```json
{
  "oldPassword": "OldPassword123!",
  "newPassword": "NewSecurePassword123!"
}
```

**Success Response** (200 OK):
```json
{
  "statusCode": 200,
  "message": "Password changed successfully"
}
```

**Error Responses**:
- 400: Old password incorrect
- 400: New password validation failed

---

### Get Users by Role

Retrieve all users with a specific role (Admin only).

**Endpoint**: `GET /api/users/role/{role}`

**Authentication**: Required (Bearer Token)

**Authorization**: ROLE_ADMIN only

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| role | Enum | ROLE_ADMIN, ROLE_DOCTOR, or ROLE_PATIENT |

**Success Response** (200 OK):
```json
{
  "statusCode": 200,
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Dr. Jane Smith",
      "email": "jane.smith@example.com",
      "role": "ROLE_DOCTOR"
    }
  ]
}
```

---

### Delete User

Delete a user (Admin only).

**Endpoint**: `DELETE /api/users/{id}`

**Authentication**: Required (Bearer Token)

**Authorization**: ROLE_ADMIN only

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | Long | User ID |

**Success Response** (200 OK):
```json
{
  "statusCode": 200,
  "message": "User deleted successfully"
}
```

---

## Doctor Endpoints

### Update Doctor Profile

Update doctor-specific information.

**Endpoint**: `PUT /api/doctors/{id}`

**Authentication**: Required (Bearer Token)

**Authorization**: Own profile or ROLE_ADMIN

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | Long | Doctor ID (same as User ID) |

**Request Body**:
```json
{
  "specialization": "Cardiology",
  "experience": 10,
  "availableHours": "Mon-Fri: 9AM-5PM"
}
```

**Request Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| specialization | String | Yes | Medical specialization |
| experience | Integer | Yes | Years of experience |
| availableHours | String | Yes | Available hours description |

**Success Response** (200 OK):
```json
{
  "statusCode": 200,
  "message": "Doctor profile updated successfully",
  "data": {
    "id": 1,
    "user": {
      "id": 1,
      "name": "Dr. Jane Smith",
      "email": "jane.smith@example.com"
    },
    "specialization": "Cardiology",
    "experience": 10,
    "availableHours": "Mon-Fri: 9AM-5PM"
  }
}
```

---

## Patient Endpoints

### Update Patient Profile

Update patient-specific information.

**Endpoint**: `PUT /api/patients/{id}`

**Authentication**: Required (Bearer Token)

**Authorization**: Own profile or ROLE_ADMIN

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | Long | Patient ID (same as User ID) |

**Request Body**:
```json
{
  "medicalHistory": "No known allergies",
  "emergencyContact": "Jane Doe - 555-1234"
}
```

**Success Response** (200 OK):
```json
{
  "statusCode": 200,
  "message": "Patient profile updated successfully",
  "data": {
    "id": 1,
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com"
    }
  }
}
```

---

## Appointment Endpoints

### Get All Appointments

Retrieve all appointments (Admin only).

**Endpoint**: `GET /api/appointments`

**Authentication**: Required (Bearer Token)

**Authorization**: ROLE_ADMIN only

**Success Response** (200 OK):
```json
{
  "statusCode": 200,
  "message": "Appointments retrieved successfully",
  "data": [
    {
      "id": 1,
      "appointmentCode": "APT-2025-001",
      "appointmentDateTime": "2025-10-15T10:00:00",
      "status": "SCHEDULED",
      "notes": "Regular checkup",
      "doctorName": "Dr. Jane Smith",
      "patientName": "John Doe",
      "createdAt": "2025-10-01T09:00:00"
    }
  ]
}
```

---

### Get Appointment by ID

Retrieve a specific appointment.

**Endpoint**: `GET /api/appointments/{id}`

**Authentication**: Required (Bearer Token)

**Authorization**: Own appointment or ROLE_ADMIN

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | Long | Appointment ID |

**Success Response** (200 OK):
```json
{
  "statusCode": 200,
  "message": "Appointment retrieved successfully",
  "data": {
    "id": 1,
    "appointmentCode": "APT-2025-001",
    "appointmentDateTime": "2025-10-15T10:00:00",
    "status": "SCHEDULED",
    "notes": "Regular checkup",
    "doctor": {
      "id": 2,
      "name": "Dr. Jane Smith",
      "specialization": "Cardiology"
    },
    "patient": {
      "id": 1,
      "name": "John Doe"
    }
  }
}
```

---

### Get Appointment by Code

Retrieve an appointment using its unique code.

**Endpoint**: `GET /api/appointments/code/{appointmentCode}`

**Authentication**: Required (Bearer Token)

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| appointmentCode | String | Unique appointment code |

**Success Response**: Same as Get Appointment by ID

---

### Get Appointments by Doctor

Retrieve all appointments for a specific doctor.

**Endpoint**: `GET /api/appointments/doctor/{doctorId}`

**Authentication**: Required (Bearer Token)

**Authorization**: Own appointments or ROLE_ADMIN

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| doctorId | Long | Doctor ID |

**Success Response**: Array of appointments

---

### Get Appointments by Patient

Retrieve all appointments for a specific patient.

**Endpoint**: `GET /api/appointments/patient/{patientId}`

**Authentication**: Required (Bearer Token)

**Authorization**: Own appointments or ROLE_ADMIN

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| patientId | Long | Patient ID |

**Success Response**: Array of appointments

---

### Create Appointment

Schedule a new appointment.

**Endpoint**: `POST /api/appointments/{patientId}/{doctorId}`

**Authentication**: Required (Bearer Token)

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| patientId | Long | Patient ID |
| doctorId | Long | Doctor ID |

**Request Body**:
```json
{
  "appointmentDateTime": "2025-10-15T10:00:00",
  "status": "SCHEDULED",
  "notes": "Regular checkup"
}
```

**Request Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| appointmentDateTime | DateTime | Yes | Must be in the future (ISO 8601 format) |
| status | Enum | No | SCHEDULED (default), COMPLETED, CANCELLED |
| notes | String | No | Additional notes |

**Success Response** (201 Created):
```json
{
  "statusCode": 201,
  "message": "Appointment created successfully",
  "data": {
    "id": 1,
    "appointmentCode": "APT-2025-001",
    "appointmentDateTime": "2025-10-15T10:00:00",
    "status": "SCHEDULED",
    "notes": "Regular checkup"
  }
}
```

**Error Responses**:
- 400: Invalid date/time (must be in future)
- 404: Doctor or patient not found
- 409: Time slot already booked

---

### Update Appointment Status

Update the status of an appointment.

**Endpoint**: `PUT /api/appointments/{id}/status`

**Authentication**: Required (Bearer Token)

**Authorization**: ROLE_ADMIN or involved doctor/patient

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | Long | Appointment ID |

**Request Body**:
```json
{
  "status": "COMPLETED"
}
```

**Status Values**:
- SCHEDULED
- COMPLETED
- CANCELLED
- RESCHEDULED
- NO_SHOW

**Success Response** (200 OK):
```json
{
  "statusCode": 200,
  "message": "Appointment status updated successfully",
  "data": {
    "id": 1,
    "appointmentCode": "APT-2025-001",
    "status": "COMPLETED"
  }
}
```

---

### Delete Appointment

Cancel/delete an appointment.

**Endpoint**: `DELETE /api/appointments/{id}`

**Authentication**: Required (Bearer Token)

**Authorization**: Own appointment or ROLE_ADMIN

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | Long | Appointment ID |

**Success Response** (200 OK):
```json
{
  "statusCode": 200,
  "message": "Appointment deleted successfully"
}
```

---

## Data Models

### UserDTO

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "1234567890",
  "role": "ROLE_PATIENT",
  "gender": "MALE",
  "dateOfBirth": "1990-01-15",
  "address": "123 Main Street",
  "createdDate": "2025-01-01T10:00:00",
  "updatedDate": "2025-01-01T10:00:00"
}
```

### DoctorDTO

```json
{
  "id": 1,
  "user": { /* UserDTO */ },
  "specialization": "Cardiology",
  "experience": 10,
  "availableHours": "Mon-Fri: 9AM-5PM",
  "createdAt": "2025-01-01T10:00:00",
  "updatedAt": "2025-01-01T10:00:00"
}
```

### PatientDTO

```json
{
  "id": 1,
  "user": { /* UserDTO */ },
  "createdAt": "2025-01-01T10:00:00",
  "updatedAt": "2025-01-01T10:00:00"
}
```

### AppointmentDTO

```json
{
  "id": 1,
  "appointmentCode": "APT-2025-001",
  "appointmentDateTime": "2025-10-15T10:00:00",
  "status": "SCHEDULED",
  "notes": "Regular checkup",
  "doctor": { /* DoctorDTO */ },
  "patient": { /* PatientDTO */ },
  "createdAt": "2025-10-01T09:00:00",
  "updatedAt": "2025-10-01T09:00:00"
}
```

---

## Postman Collection

A complete Postman collection is available at `server/Documentation/Postman_Collection.json`. Import this file into Postman for easy API testing.

## Next Steps

- See [SECURITY.md](SECURITY.md) for security implementation details
- See [DEVELOPMENT.md](DEVELOPMENT.md) for API development guidelines
- See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common API issues
