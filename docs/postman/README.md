# HealthMate API Postman Collection

This directory contains the complete Postman collection for testing all HealthMate Advanced API endpoints.

## Files

- **HealthMate-API-Collection.json** - Complete API collection with all endpoints

## Import Instructions

### Method 1: Import from File

1. Open Postman
2. Click **Import** button (top left)
3. Click **Upload Files**
4. Select `HealthMate-API-Collection.json`
5. Click **Import**

### Method 2: Import from URL

1. Open Postman
2. Click **Import** button
3. Select **Link** tab
4. Paste the raw GitHub URL of the collection
5. Click **Continue** → **Import**

## Environment Setup

### Create Environment

1. Click **Environments** in Postman (left sidebar)
2. Click **+** to create new environment
3. Name it "HealthMate Development"
4. Add the following variables:

| Variable | Initial Value | Current Value |
|----------|--------------|---------------|
| `baseUrl` | `http://localhost:8080/api` | `http://localhost:8080/api` |
| `authToken` | (leave empty) | (leave empty) |
| `userId` | `1` | `1` |
| `doctorId` | `1` | `1` |
| `patientId` | `1` | `1` |
| `appointmentId` | `1` | `1` |
| `notificationId` | `1` | `1` |

5. Click **Save**
6. Select this environment from the dropdown (top right)

## Usage Guide

### 1. Authentication Flow

#### Register and Login
1. **Register User**: Use `Authentication → Register User`
   - Modify the request body with your details
   - Available roles: `PATIENT`, `DOCTOR`, `ADMIN`

2. **Login**: Use `Authentication → Login`
   - The collection automatically saves the JWT token to `authToken` variable
   - All authenticated requests will use this token

### 2. Testing Endpoints

The collection is organized into folders:

- **Authentication** - Registration, login, password management
- **Users** - User management and profile operations
- **Doctors** - Doctor management, schedules, and time slots
- **Patients** - Patient management
- **Appointments** - Appointment booking and management
- **Notifications** - Notification retrieval and management
- **Dashboard** - Statistics and analytics

### 3. Variables

Update these variables in your environment or directly in the collection:

- `baseUrl`: API base URL (default: `http://localhost:8080/api`)
- `authToken`: JWT token (auto-populated after login)
- `userId`, `doctorId`, `patientId`, etc.: Entity IDs for testing

### 4. Authorization

Most endpoints require authentication. The collection uses Bearer Token authorization:

- Token is automatically set after successful login
- If you get 401 Unauthorized, login again to refresh the token
- Admin-only endpoints require `ADMIN` role
- Doctor endpoints require `ADMIN` or `DOCTOR` role

## Collection Structure

### Authentication Endpoints

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| Register User | POST | Create new user account | No |
| Login | POST | Authenticate user | No |
| Request Password Reset | POST | Request OTP for password reset | No |
| Verify Password Reset OTP | POST | Verify OTP | No |
| Reset Password with OTP | POST | Reset password using OTP | No |
| Request Password Change OTP | POST | Request OTP for password change | Yes |
| Change Password with OTP | PUT | Change password using OTP | Yes |

### User Endpoints

| Endpoint | Method | Description | Auth Required | Role |
|----------|--------|-------------|---------------|------|
| Get All Users | GET | List all users (paginated) | Yes | Admin |
| Get Current User | GET | Get logged-in user details | Yes | Any |
| Update Current User | PUT | Update own profile | Yes | Any |
| Get User by ID | GET | Get user by ID | Yes | Any |
| Change Password | PUT | Change password | Yes | Any |
| Update User | PUT | Update user by ID | Yes | Admin |
| Delete User | DELETE | Delete user | Yes | Admin |
| Get Users by Role | GET | Get users by role | Yes | Admin |

### Doctor Endpoints

| Endpoint | Method | Description | Auth Required | Role |
|----------|--------|-------------|---------------|------|
| Get All Doctors | GET | List all doctors | No | - |
| Get All Specializations | GET | Get specializations list | No | - |
| Get Doctor by ID | GET | Get doctor details | No | - |
| Get Doctors by Specialization | GET | Filter doctors | No | - |
| Update Doctor | PUT | Update doctor profile | Yes | Doctor/Admin |
| Delete Doctor | DELETE | Delete doctor | Yes | Admin |
| Set Doctor Schedule | POST | Configure weekly schedule | Yes | Doctor/Admin |
| Get Doctor Schedule | GET | View doctor schedule | No | - |
| Generate Time Slots | POST | Generate appointment slots | Yes | Doctor/Admin |
| Get Available Slots | GET | View available slots | No | - |

### Patient Endpoints

| Endpoint | Method | Description | Auth Required | Role |
|----------|--------|-------------|---------------|------|
| Get All Patients | GET | List all patients | Yes | Admin |
| Get Patient by ID | GET | Get patient details | Yes | Any |
| Update Patient | PUT | Update patient profile | Yes | Admin |
| Delete Patient | DELETE | Delete patient | Yes | Admin |

### Appointment Endpoints

| Endpoint | Method | Description | Auth Required | Role |
|----------|--------|-------------|---------------|------|
| Get All Appointments | GET | List all appointments | Yes | Admin |
| Create Appointment | POST | Book new appointment | Yes | Any |
| Get Appointment by ID | GET | Get appointment details | Yes | Any |
| Get Appointment by Code | GET | Get by appointment code | Yes | Any |
| Get Appointments by Doctor | GET | Doctor's appointments | Yes | Doctor/Admin |
| Get Appointments by Patient | GET | Patient's appointments | Yes | Admin |
| Update Appointment Status | PUT | Update status | Yes | Doctor/Admin |
| Delete Appointment | DELETE | Cancel appointment | Yes | Any |

### Notification Endpoints

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| Get User Notifications | GET | All user notifications | Yes |
| Get Unread Notifications | GET | Unread notifications | Yes |
| Get Unread Count | GET | Count of unread | Yes |
| Mark Notification as Read | PUT | Mark single as read | Yes |
| Mark All as Read | PUT | Mark all as read | Yes |

### Dashboard Endpoints

| Endpoint | Method | Description | Auth Required | Role |
|----------|--------|-------------|---------------|------|
| Get Admin Dashboard | GET | Admin statistics | Yes | Admin |
| Get Doctor Dashboard | GET | Doctor statistics | Yes | Doctor/Admin |

## Example Workflow

### Complete User Journey

1. **Register as Patient**
   ```
   POST /api/auth/register
   Body: { email, password, firstName, lastName, role: "PATIENT", ... }
   ```

2. **Login**
   ```
   POST /api/auth/login
   Body: { email, password }
   Response: { token: "..." }
   ```

3. **Get All Doctors**
   ```
   GET /api/doctors?specialty=Cardiology
   ```

4. **View Doctor Schedule**
   ```
   GET /api/doctors/{doctorId}/schedule
   ```

5. **Get Available Slots**
   ```
   GET /api/doctors/{doctorId}/slots?date=2024-01-15
   ```

6. **Book Appointment**
   ```
   POST /api/appointments/{patientId}/{doctorId}
   Body: { appointmentDate, reason, timeSlotId }
   ```

7. **View Appointment**
   ```
   GET /api/appointments/{appointmentId}
   ```

8. **Check Notifications**
   ```
   GET /api/notifications/user/{userId}/unread
   ```

## Testing Tips

### 1. Sequential Testing

Test in this order for best results:
1. Authentication (register → login)
2. User management
3. Doctor setup (schedule → slots)
4. Patient operations
5. Appointment booking
6. Notifications

### 2. Environment Switching

Create multiple environments for different scenarios:
- **Development**: `http://localhost:8080/api`
- **Production**: `https://api.healthmate.com/api`
- **Testing**: `http://test-server:8080/api`

### 3. Token Refresh

If you encounter 401 errors:
1. Run the Login request again
2. Token is automatically saved to environment
3. Retry your failed request

### 4. Pre-request Scripts

The collection includes automatic token extraction. Check the Login request's "Tests" tab for the script.

### 5. Bulk Testing

Use Postman's Collection Runner to:
1. Run all requests sequentially
2. Test multiple scenarios
3. Generate test reports

## Common Issues

### Issue: 401 Unauthorized
**Solution**: Login again to get a fresh token

### Issue: 403 Forbidden
**Solution**: Check if your user has the required role

### Issue: 404 Not Found
**Solution**: Verify entity IDs exist in database

### Issue: Connection Refused
**Solution**: Ensure backend server is running on port 8080

### Issue: Invalid Request Body
**Solution**: Check request body format matches API documentation

## Additional Resources

- **API Documentation**: See [API.md](../backend/API.md)
- **Setup Guide**: See [SETUP.md](../backend/SETUP.md)
- **WebSocket Testing**: Use WebSocket client (not available in Postman)

## Contributing

To add new endpoints to the collection:

1. Update the JSON file with new request
2. Test the new endpoint
3. Update this README with the new endpoint details
4. Submit a pull request

## Version History

- **v1.0.0** - Initial collection with all core endpoints
  - Authentication & Authorization
  - User Management
  - Doctor & Patient Management
  - Appointment Booking
  - Notification System
  - Dashboard Analytics

## Support

For issues or questions:
- Open an issue on GitHub
- Check the main documentation in `/docs/backend/`
- Review the API documentation

---

**Note**: This collection is designed for the HealthMate Advanced API. Make sure your backend server is running before testing.
