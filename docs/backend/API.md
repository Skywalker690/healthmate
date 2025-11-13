# API Documentation

## Base URL
```
Development: http://localhost:8080/api
Production: [Your production URL]/api
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Response Format
All API responses follow this structure:
```json
{
  "statusCode": 200,
  "message": "Success message",
  "data": { /* response data */ },
  "error": null
}
```

---

## Authentication Endpoints

### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "PATIENT",
  "phoneNumber": "1234567890",
  "gender": "MALE"
}
```

**Response:** `200 OK`
```json
{
  "statusCode": 200,
  "message": "User registered successfully",
  "data": {
    "user": { /* user details */ },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response:** `200 OK`
```json
{
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "user": { /* user details */ },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expirationTime": "2024-01-01T12:00:00"
  }
}
```

---

### Request Password Reset
```http
POST /auth/forgot-password/request
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:** `200 OK`

---

### Verify Password Reset OTP
```http
POST /auth/forgot-password/verify
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response:** `200 OK`

---

### Reset Password with OTP
```http
POST /auth/forgot-password/reset
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "NewSecurePass123"
}
```

**Response:** `200 OK`

---

### Request Password Change OTP (Authenticated)
```http
POST /auth/password/otp/request
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

---

### Change Password with OTP (Authenticated)
```http
PUT /auth/password/otp
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "otp": "123456",
  "newPassword": "NewSecurePass123"
}
```

**Response:** `200 OK`

---

## User Management Endpoints

### Get All Users (Admin Only)
```http
GET /users?search=john&page=0&size=10
```

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `search` (optional): Search term for filtering
- `page` (default: 0): Page number
- `size` (default: 10): Items per page

**Response:** `200 OK`
```json
{
  "statusCode": 200,
  "message": "Users retrieved successfully",
  "data": {
    "users": [ /* paginated user list */ ],
    "totalPages": 5,
    "totalElements": 50
  }
}
```

---

### Get User by ID
```http
GET /users/{id}
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

---

### Get Current User
```http
GET /users/me
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

---

### Update Current User
```http
PUT /users/me
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "phoneNumber": "9876543210",
  "gender": "FEMALE"
}
```

**Response:** `200 OK`

---

### Change Password (Authenticated)
```http
PUT /users/me/password
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "currentPassword": "OldPass123",
  "newPassword": "NewPass123"
}
```

**Response:** `200 OK`

---

### Update User (Admin Only)
```http
PUT /users/{id}
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

---

### Delete User (Admin Only)
```http
DELETE /users/{id}
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

---

### Get Users by Role (Admin Only)
```http
GET /users/role/{role}
```

**Headers:** `Authorization: Bearer <token>`

**Path Parameters:**
- `role`: ADMIN, DOCTOR, or PATIENT

**Response:** `200 OK`

---

## Doctor Endpoints

### Get All Doctors
```http
GET /doctors?search=cardio&specialty=Cardiology&page=0&size=10
```

**Query Parameters:**
- `search` (optional): Search term
- `specialty` (optional): Filter by specialization
- `page` (default: 0): Page number
- `size` (default: 10): Items per page

**Response:** `200 OK`
```json
{
  "statusCode": 200,
  "data": {
    "doctors": [
      {
        "id": 1,
        "userId": 10,
        "firstName": "Dr. John",
        "lastName": "Smith",
        "email": "dr.smith@example.com",
        "specialization": "Cardiology",
        "licenseNumber": "LIC123456",
        "experienceYears": 10,
        "consultationFee": 100.00
      }
    ],
    "totalPages": 3,
    "totalElements": 25
  }
}
```

---

### Get All Specializations
```http
GET /doctors/specializations
```

**Response:** `200 OK`
```json
{
  "statusCode": 200,
  "data": {
    "specializations": [
      "Cardiology",
      "Dermatology",
      "Neurology",
      "Orthopedics",
      "Pediatrics"
    ]
  }
}
```

---

### Get Doctor by ID
```http
GET /doctors/{id}
```

**Response:** `200 OK`

---

### Get Doctors by Specialization
```http
GET /doctors/specialization/{spec}
```

**Path Parameters:**
- `spec`: Specialization name

**Response:** `200 OK`

---

### Update Doctor
```http
PUT /doctors/{id}
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "specialization": "Cardiology",
  "licenseNumber": "LIC123456",
  "experienceYears": 12,
  "consultationFee": 120.00,
  "bio": "Experienced cardiologist..."
}
```

**Response:** `200 OK`

---

### Delete Doctor (Admin Only)
```http
DELETE /doctors/{id}
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

---

## Doctor Schedule Endpoints

### Set Doctor Schedule (Admin/Doctor)
```http
POST /doctors/{doctorId}/schedule
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
[
  {
    "dayOfWeek": "MONDAY",
    "startTime": "09:00",
    "endTime": "17:00",
    "breakStartTime": "12:00",
    "breakEndTime": "13:00"
  },
  {
    "dayOfWeek": "TUESDAY",
    "startTime": "09:00",
    "endTime": "17:00",
    "breakStartTime": "12:00",
    "breakEndTime": "13:00"
  }
]
```

**Response:** `200 OK`

---

### Get Doctor Schedule
```http
GET /doctors/{doctorId}/schedule
```

**Response:** `200 OK`
```json
{
  "statusCode": 200,
  "data": {
    "schedules": [
      {
        "dayOfWeek": "MONDAY",
        "startTime": "09:00",
        "endTime": "17:00",
        "breakStartTime": "12:00",
        "breakEndTime": "13:00"
      }
    ]
  }
}
```

---

## Time Slot Endpoints

### Generate Time Slots (Admin/Doctor)
```http
POST /doctors/{doctorId}/slots/generate
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "startDate": "2024-01-01",
  "endDate": "2024-01-31",
  "slotDurationMinutes": 30
}
```

**Response:** `200 OK`

---

### Get Available Slots
```http
GET /doctors/{doctorId}/slots?date=2024-01-15
```

**Query Parameters:**
- `date` (required): Date in ISO format (YYYY-MM-DD)

**Response:** `200 OK`
```json
{
  "statusCode": 200,
  "data": {
    "slots": [
      {
        "id": 1,
        "startTime": "2024-01-15T09:00:00",
        "endTime": "2024-01-15T09:30:00",
        "status": "AVAILABLE"
      },
      {
        "id": 2,
        "startTime": "2024-01-15T09:30:00",
        "endTime": "2024-01-15T10:00:00",
        "status": "BOOKED"
      }
    ]
  }
}
```

---

## Patient Endpoints

### Get All Patients (Admin Only)
```http
GET /patients?search=john&page=0&size=10
```

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `search` (optional): Search term
- `page` (default: 0): Page number
- `size` (default: 10): Items per page

**Response:** `200 OK`

---

### Get Patient by ID
```http
GET /patients/{id}
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

---

### Update Patient (Admin Only)
```http
PUT /patients/{id}
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

---

### Delete Patient (Admin Only)
```http
DELETE /patients/{id}
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

---

## Appointment Endpoints

### Get All Appointments (Admin Only)
```http
GET /appointments?status=SCHEDULED&startDate=2024-01-01&endDate=2024-01-31&page=0&size=10
```

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `status` (optional): SCHEDULED, COMPLETED, CANCELLED
- `startDate` (optional): Filter start date (ISO format)
- `endDate` (optional): Filter end date (ISO format)
- `page` (default: 0): Page number
- `size` (default: 10): Items per page

**Response:** `200 OK`

---

### Create Appointment
```http
POST /appointments/{patientId}/{doctorId}
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "appointmentDate": "2024-01-15T10:00:00",
  "reason": "Regular checkup",
  "timeSlotId": 123
}
```

**Response:** `200 OK`
```json
{
  "statusCode": 200,
  "message": "Appointment created successfully",
  "data": {
    "appointment": {
      "id": 1,
      "appointmentCode": "APT-20240115-001",
      "appointmentDate": "2024-01-15T10:00:00",
      "status": "SCHEDULED",
      "reason": "Regular checkup"
    }
  }
}
```

---

### Get Appointment by ID
```http
GET /appointments/{id}
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

---

### Get Appointment by Code
```http
GET /appointments/code/{appointmentCode}
```

**Headers:** `Authorization: Bearer <token>`

**Path Parameters:**
- `appointmentCode`: Unique appointment code (e.g., APT-20240115-001)

**Response:** `200 OK`

---

### Get Appointments by Doctor (Admin/Doctor)
```http
GET /appointments/doctor/{doctorId}
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

---

### Get Appointments by Patient (Admin)
```http
GET /appointments/patient/{patientId}
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

---

### Update Appointment Status (Admin/Doctor)
```http
PUT /appointments/{id}/status
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "status": "COMPLETED"
}
```

**Values:** SCHEDULED, COMPLETED, CANCELLED

**Response:** `200 OK`

---

### Delete Appointment
```http
DELETE /appointments/{id}
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

---

## Dashboard Endpoints

### Get Admin Dashboard (Admin Only)
```http
GET /dashboard/admin
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "statusCode": 200,
  "data": {
    "totalUsers": 150,
    "totalDoctors": 20,
    "totalPatients": 130,
    "totalAppointments": 500,
    "scheduledAppointments": 50,
    "completedAppointments": 400,
    "cancelledAppointments": 50,
    "topDoctors": [
      {
        "doctorId": 1,
        "doctorName": "Dr. John Smith",
        "specialization": "Cardiology",
        "appointmentCount": 100
      }
    ],
    "recentAppointments": [ /* recent appointments */ ]
  }
}
```

---

### Get Doctor Dashboard (Admin/Doctor)
```http
GET /dashboard/doctor/{doctorId}
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "statusCode": 200,
  "data": {
    "totalAppointments": 100,
    "scheduledAppointments": 10,
    "completedAppointments": 80,
    "cancelledAppointments": 10,
    "todayAppointments": 5,
    "upcomingAppointments": [ /* upcoming appointments */ ]
  }
}
```

---

## Notification Endpoints

### Get User Notifications
```http
GET /notifications/user/{userId}
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "userId": 10,
    "message": "Your appointment is scheduled for tomorrow at 10:00 AM",
    "isRead": false,
    "timestamp": "2024-01-14T15:30:00"
  }
]
```

---

### Get Unread Notifications
```http
GET /notifications/user/{userId}/unread
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

---

### Get Unread Count
```http
GET /notifications/user/{userId}/unread/count
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
5
```

---

### Mark Notification as Read
```http
PUT /notifications/{notificationId}/read
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

---

### Mark All Notifications as Read
```http
PUT /notifications/user/{userId}/read-all
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

---

### Stream Notifications (SSE)
```http
GET /notifications/stream/{userId}
```

**Headers:** `Authorization: Bearer <token>`

**Response:** Server-Sent Events stream
```
event: connected
data: Connected to notification stream

event: notification
data: {"id":1,"userId":10,"message":"New notification","isRead":false}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Invalid input parameters"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Forbidden",
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Resource not found",
  "error": "User with ID 123 not found"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "An unexpected error occurred"
}
```

---

## Rate Limiting
Currently not implemented. Consider implementing rate limiting for production use.

## Pagination
Endpoints that support pagination use the following query parameters:
- `page`: Zero-based page index (default: 0)
- `size`: Number of items per page (default: 10, max: 100)

## Date/Time Format
All date/time fields use ISO 8601 format:
- Date: `YYYY-MM-DD`
- DateTime: `YYYY-MM-DDTHH:mm:ss`

## CORS
The API allows requests from:
- `http://localhost:3000` (development)
- `https://healthmate-rose.vercel.app` (production)
