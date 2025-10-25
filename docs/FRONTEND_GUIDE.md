# Frontend Guide

Complete guide to the HealthMate React frontend application.

## Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [State Management](#state-management)
- [Routing](#routing)
- [API Integration](#api-integration)
- [Component Library](#component-library)
- [Styling](#styling)
- [Authentication Flow](#authentication-flow)
- [Best Practices](#best-practices)

## Overview

The HealthMate frontend is a modern React application built with functional components and hooks. It provides a responsive, user-friendly interface for patients, doctors, and administrators.

### Key Features

- ✅ Role-based routing and access control
- ✅ Context API for state management
- ✅ Axios for HTTP requests
- ✅ Tailwind CSS for styling
- ✅ Responsive design (mobile-first)
- ✅ Smooth animations with Framer Motion
- ✅ Protected routes for authenticated users

## Technology Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.1.1 | UI library |
| React Router DOM | 7.9.3 | Client-side routing |
| Axios | 1.12.2 | HTTP client |
| Tailwind CSS | 3.4.17 | Utility-first CSS framework |
| Heroicons | 2.2.0 | Icon library |
| Framer Motion | 11.0.0 | Animation library |

### Development Tools

- **React Scripts**: Build and development scripts
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing
- **ESLint**: Code linting

## Project Structure

```
client/
├── public/                      # Static assets
│   ├── index.html              # HTML template
│   ├── favicon.ico             # Favicon
│   └── manifest.json           # PWA manifest
│
├── src/
│   ├── components/             # Reusable components
│   │   └── common/
│   │       ├── ProtectedRoute.js
│   │       ├── Modal.js
│   │       ├── LoadingSpinner.js
│   │       └── ChangePassword.js
│   │
│   ├── contexts/               # Context providers
│   │   ├── AuthContext.js     # Authentication state
│   │   └── ThemeContext.js    # Theme state
│   │
│   ├── pages/                  # Page components
│   │   ├── LandingPage.js     # Public landing page
│   │   ├── Unauthorized.js    # Unauthorized access page
│   │   │
│   │   ├── auth/              # Authentication pages
│   │   │   ├── Login.js
│   │   │   └── Register.js
│   │   │
│   │   ├── admin/             # Admin pages
│   │   │   ├── AdminDashboard.js
│   │   │   ├── UsersManagement.js
│   │   │   ├── DoctorsManagement.js
│   │   │   ├── PatientsManagement.js
│   │   │   └── AppointmentsManagement.js
│   │   │
│   │   ├── doctor/            # Doctor pages
│   │   │   ├── DoctorDashboard.js
│   │   │   ├── DoctorAppointments.js
│   │   │   └── DoctorProfile.js
│   │   │
│   │   └── patient/           # Patient pages
│   │       ├── PatientDashboard.js
│   │       ├── PatientAppointments.js
│   │       ├── BookAppointment.js
│   │       └── PatientProfile.js
│   │
│   ├── services/               # API service layer
│   │   ├── api.js             # Axios instance & interceptors
│   │   ├── authService.js     # Authentication API
│   │   ├── userService.js     # User API
│   │   ├── appointmentService.js  # Appointment API
│   │   ├── doctorService.js   # Doctor API
│   │   └── patientService.js  # Patient API
│   │
│   ├── App.js                  # Main application component
│   ├── index.js               # Application entry point
│   ├── index.css              # Global styles
│   └── setupTests.js          # Test configuration
│
├── .env.example               # Environment variables template
├── package.json               # Dependencies and scripts
├── tailwind.config.js         # Tailwind configuration
└── postcss.config.js          # PostCSS configuration
```

## State Management

### Context API

HealthMate uses React Context API for global state management.

#### AuthContext

Manages authentication state throughout the application.

**Location**: `src/contexts/AuthContext.js`

**Provides**:
```javascript
{
  user: null | UserObject,          // Current user data
  token: null | string,             // JWT token
  role: null | string,              // User role (ROLE_ADMIN, ROLE_DOCTOR, ROLE_PATIENT)
  login: (token, userData) => void, // Login function
  logout: () => void,               // Logout function
  isAuthenticated: boolean,         // Authentication status
  isLoading: boolean                // Loading state
}
```

**Usage**:
```javascript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, token, login, logout, isAuthenticated } = useAuth();
  
  // Use authentication state
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <div>Welcome, {user.name}</div>;
}
```

#### ThemeContext

Manages UI theme (light/dark mode).

**Location**: `src/contexts/ThemeContext.js`

**Provides**:
```javascript
{
  theme: 'light' | 'dark',
  toggleTheme: () => void
}
```

## Routing

### Route Structure

```javascript
// Public routes
/ (LandingPage)
/login
/register
/unauthorized

// Admin routes (ROLE_ADMIN)
/admin (AdminDashboard)
/admin/users
/admin/doctors
/admin/patients
/admin/appointments

// Doctor routes (ROLE_DOCTOR)
/doctor (DoctorDashboard)
/doctor/appointments
/doctor/profile

// Patient routes (ROLE_PATIENT)
/patient (PatientDashboard)
/patient/appointments
/patient/book-appointment
/patient/profile
```

### Protected Routes

**Component**: `ProtectedRoute.js`

Wraps routes that require authentication and authorization.

```javascript
<Route
  path="/admin"
  element={
    <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
```

**Features**:
- Checks if user is authenticated
- Verifies user has required role
- Redirects to login if not authenticated
- Redirects to unauthorized if insufficient permissions

## API Integration

### Service Layer Architecture

The service layer abstracts API calls from components.

#### API Instance (`api.js`)

Central Axios instance with interceptors.

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - Add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

#### Service Modules

**authService.js**:
```javascript
export const login = async (email, password) => {
  const response = await api.post('/api/auth/login', { email, password });
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post('/api/auth/register', userData);
  return response.data;
};
```

**userService.js**:
```javascript
export const getCurrentUser = async () => {
  const response = await api.get('/api/users/me');
  return response.data;
};

export const updateCurrentUser = async (userData) => {
  const response = await api.put('/api/users/me', userData);
  return response.data;
};
```

**appointmentService.js**:
```javascript
export const getMyAppointments = async () => {
  const response = await api.get('/api/appointments/my');
  return response.data;
};

export const createAppointment = async (patientId, doctorId, appointmentData) => {
  const response = await api.post(
    `/api/appointments/${patientId}/${doctorId}`,
    appointmentData
  );
  return response.data;
};
```

### Using Services in Components

```javascript
import { useState, useEffect } from 'react';
import { getMyAppointments } from '../services/appointmentService';
import LoadingSpinner from '../components/common/LoadingSpinner';

function AppointmentsList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const data = await getMyAppointments();
        setAppointments(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {appointments.map(apt => (
        <AppointmentCard key={apt.id} appointment={apt} />
      ))}
    </div>
  );
}
```

## Component Library

### Common Components

#### LoadingSpinner

Displays loading indicator.

**Usage**:
```javascript
import LoadingSpinner from '../components/common/LoadingSpinner';

<LoadingSpinner />
```

#### Modal

Reusable modal component.

**Props**:
- `isOpen`: boolean - Control modal visibility
- `onClose`: function - Close handler
- `title`: string - Modal title
- `children`: ReactNode - Modal content

**Usage**:
```javascript
import Modal from '../components/common/Modal';

<Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Confirm Action">
  <p>Are you sure?</p>
  <button onClick={handleConfirm}>Confirm</button>
</Modal>
```

#### ProtectedRoute

Protects routes based on authentication and roles.

**Props**:
- `allowedRoles`: string[] - Required roles
- `children`: ReactNode - Protected content

#### ChangePassword

Password change form component.

## Styling

### Tailwind CSS

HealthMate uses Tailwind CSS for styling.

**Configuration**: `tailwind.config.js`

```javascript
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f7ff',
          // ... color palette
        }
      }
    },
  },
  plugins: [],
}
```

### Common Patterns

**Button Styles**:
```javascript
<button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200">
  Click Me
</button>
```

**Card Layout**:
```javascript
<div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
  {/* Card content */}
</div>
```

**Form Input**:
```javascript
<input
  type="text"
  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  placeholder="Enter text"
/>
```

### Responsive Design

Tailwind's responsive utilities:
```javascript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Responsive grid */}
</div>
```

## Authentication Flow

### Login Flow

```
1. User enters credentials
2. Frontend → POST /api/auth/login
3. Backend validates and returns JWT token
4. Frontend stores token in localStorage
5. AuthContext updates with user data
6. Frontend redirects to role-specific dashboard
```

### Token Management

**Storing Token**:
```javascript
localStorage.setItem('token', token);
```

**Adding Token to Requests** (via interceptor):
```javascript
config.headers.Authorization = `Bearer ${token}`;
```

**Removing Token on Logout**:
```javascript
localStorage.removeItem('token');
localStorage.removeItem('user');
```

### Protected Component Example

```javascript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, role, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
```

## Best Practices

### Component Design

1. **Keep components small and focused**
   ```javascript
   // Good: Single responsibility
   function UserCard({ user }) {
     return <div>{user.name}</div>;
   }
   ```

2. **Use functional components and hooks**
   ```javascript
   // Use hooks for state and effects
   const [data, setData] = useState([]);
   useEffect(() => { /* fetch data */ }, []);
   ```

3. **Extract reusable logic to custom hooks**
   ```javascript
   function useAppointments() {
     const [appointments, setAppointments] = useState([]);
     const [loading, setLoading] = useState(true);
     
     useEffect(() => {
       fetchAppointments().then(setAppointments).finally(() => setLoading(false));
     }, []);
     
     return { appointments, loading };
   }
   ```

### State Management

1. **Use Context for global state only**
   - Authentication
   - Theme preferences
   - User data

2. **Use local state for component-specific data**
   ```javascript
   const [formData, setFormData] = useState({});
   ```

3. **Lift state up when needed**
   - Share state between sibling components
   - Move state to nearest common ancestor

### API Calls

1. **Always handle loading and error states**
   ```javascript
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   ```

2. **Use try-catch for async operations**
   ```javascript
   try {
     const data = await fetchData();
     setData(data);
   } catch (err) {
     setError(err.message);
   }
   ```

3. **Clean up on unmount**
   ```javascript
   useEffect(() => {
     let cancelled = false;
     
     fetchData().then(data => {
       if (!cancelled) setData(data);
     });
     
     return () => { cancelled = true; };
   }, []);
   ```

### Performance

1. **Memoize expensive computations**
   ```javascript
   const sortedData = useMemo(() => 
     data.sort((a, b) => a.name.localeCompare(b.name)),
     [data]
   );
   ```

2. **Use React.memo for pure components**
   ```javascript
   const UserCard = React.memo(({ user }) => {
     return <div>{user.name}</div>;
   });
   ```

3. **Lazy load routes**
   ```javascript
   const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
   ```

### Code Organization

1. **Group related files together**
   - Components with their styles
   - Services by domain

2. **Use absolute imports**
   ```javascript
   import { useAuth } from 'contexts/AuthContext';
   ```

3. **Consistent naming conventions**
   - PascalCase for components
   - camelCase for functions and variables
   - UPPER_CASE for constants

## Development Workflow

### Running the Application

```bash
npm start        # Start development server
npm test         # Run tests
npm run build    # Build for production
npm run eject    # Eject from Create React App
```

### Adding New Features

1. Create service methods in appropriate service file
2. Create/update page components
3. Add routes in App.js
4. Update navigation/UI components
5. Test thoroughly

### Debugging

**React DevTools**: Install browser extension for component inspection

**Console Logging**:
```javascript
console.log('State:', state);
console.error('Error:', error);
```

**Network Tab**: Monitor API requests in browser DevTools

## Testing

### Testing Library

The project uses React Testing Library.

**Example Test**:
```javascript
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders landing page', () => {
  render(<App />);
  const element = screen.getByText(/HealthMate/i);
  expect(element).toBeInTheDocument();
});
```

## Next Steps

- Review [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API details
- Check [DEVELOPMENT.md](DEVELOPMENT.md) for contribution guidelines
- See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common issues

## Resources

- [React Documentation](https://react.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Axios Documentation](https://axios-http.com/docs/intro)
