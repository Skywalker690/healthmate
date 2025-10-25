# API_CONTRACT.md

---

## 1. Authentication

### Login

**POST** `/api/auth/login`

* **Auth:** None
* **Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

* **Response:**

```json
{
  "statusCode": 200,
  "token": "<JWT_TOKEN>",
  "role": "ROLE_PATIENT"
}
```

### Register

**POST** `/api/auth/register`

* **Auth:** None
* **Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "ROLE_PATIENT"
}
```

* **Response:**

```json
{
  "statusCode": 200,
  "message": "User registered successfully"
}
```

---

## 2. Users

### Get All Users

**GET** `/api/users`

* **Auth:** Bearer Token
* **Role:** ADMIN
* **Response:** List of UserDTO

### Get User by ID

**GET** `/api/users/{id}`

* **Auth:** Bearer Token
* **Response:** UserDTO

### Delete User

**DELETE** `/api/users/{id}`

* **Auth:** Bearer Token
* **Role:** ADMIN
* **Response:** Success/Failure message

### Update User by ID (Admin)

**PUT** `/api/users/{id}`

* **Auth:** Bearer Token
* **Role:** ADMIN
* **Body:** UpdateUserRequest JSON
* **Response:** Updated UserDTO

### Get Users by Role

**GET** `/api/users/role/{role}`

* **Auth:** Bearer Token
* **Role:** ADMIN
* **Response:** List of UserDTO

### Get Current User

**GET** `/api/users/me`

* **Auth:** Bearer Token
* **Response:** UserDTO

### Update Current User

**PUT** `/api/users/me`

* **Auth:** Bearer Token
* **Body:** UpdateUserRequest JSON
* **Response:** Updated UserDTO

### Change Password

**PUT** `/api/users/me/password`

* **Auth:** Bearer Token
* **Body:**

```json
{
  "oldPassword": "oldpass",
  "newPassword": "newpass"
}
```

* **Response:** Success/Failure message

---

## 3. Doctors

### Update Doctor

**PUT** `/api/doctors/{id}`

* **Auth:** Bearer Token
* **Body:** DoctorUpdateRequest JSON
* **Response:** Updated DoctorDTO

---

## 4. Patients

### Update Patient

**PUT** `/api/patients/{id}`

* **Auth:** Bearer Token
* **Body:** PatientUpdateRequest JSON
* **Response:** Updated PatientDTO

---

## 5. Appointments

### Get All Appointments

**GET** `/api/appointments`

* **Auth:** Bearer Token
* **Role:** ADMIN
* **Response:** List of AppointmentDTO

### Get Appointment by ID

**GET** `/api/appointments/{id}`

* **Auth:** Bearer Token
* **Response:** AppointmentDTO

### Get Appointment by Code

**GET** `/api/appointments/code/{appointmentCode}`

* **Auth:** Bearer Token
* **Response:** AppointmentDTO

### Get Appointments by Doctor

**GET** `/api/appointments/doctor/{doctorId}`

* **Auth:** Bearer Token
* **Role:** ADMIN
* **Response:** List of AppointmentDTO

### Get Appointments by Patient

**GET** `/api/appointments/patient/{patientId}`

* **Auth:** Bearer Token
* **Role:** ADMIN
* **Response:** List of AppointmentDTO

### Create Appointment

**POST** `/api/appointments/{patientId}/{doctorId}`

* **Auth:** Bearer Token
* **Body:**

```json
{
  "appointmentDateTime": "2025-10-01T10:30:00",
  "status": "SCHEDULED",
  "notes": "First appointment"
}
```

* **Response:** Created AppointmentDTO

### Update Appointment Status

**PUT** `/api/appointments/{id}/status`

* **Auth:** Bearer Token
* **Role:** ADMIN
* **Body:**

```json
{
  "status": "COMPLETED"
}
```

* **Response:** Updated AppointmentDTO

### Delete Appointment

**DELETE** `/api/appointments/{id}`

* **Auth:** Bearer Token
* **Response:** Success/Failure message

---

## 6. Notes

* All endpoints require **JWT Bearer token** except `/api/auth/**`.
* Roles:

    * `ROLE_ADMIN`: Full access to manage users, doctors, patients, appointments.
    * `ROLE_DOCTOR`: Can update own profile and view appointments.
    * `ROLE_PATIENT`: Can update own profile and view appointments.
* All responses include at least: `statusCode`, `message`, optionally `data` like DTO objects.
* DTO objects:

    * UserDTO, DoctorDTO, PatientDTO, AppointmentDTO
