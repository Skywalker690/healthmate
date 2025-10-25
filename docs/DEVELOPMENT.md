# Development Guide

Complete guide for developers contributing to HealthMate.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Environment](#development-environment)
- [Code Structure](#code-structure)
- [Coding Standards](#coding-standards)
- [Git Workflow](#git-workflow)
- [Testing](#testing)
- [Debugging](#debugging)
- [Code Review Process](#code-review-process)
- [Contributing Guidelines](#contributing-guidelines)

## Getting Started

### Prerequisites

Before you begin development, ensure you have:

- Java JDK 17 or higher
- Node.js 18 or higher
- PostgreSQL 14 or higher
- Maven 3.8+ (or use included wrapper)
- Git 2.30+
- IDE (IntelliJ IDEA, VS Code, or Eclipse)

### Initial Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Healthmate1.git
   cd Healthmate1
   ```

2. **Set Up Backend**
   ```bash
   cd server
   cp src/main/resources/.env.example src/main/resources/.env
   # Edit .env with your configuration
   ./mvnw clean install
   ```

3. **Set Up Frontend**
   ```bash
   cd ../client
   cp .env.example .env
   # Edit .env if needed
   npm install
   ```

4. **Create Database**
   ```sql
   CREATE DATABASE healthmate;
   ```

5. **Run Application**
   ```bash
   # Terminal 1 - Backend
   cd server
   ./mvnw spring-boot:run

   # Terminal 2 - Frontend
   cd client
   npm start
   ```

## Development Environment

### Recommended IDEs

#### IntelliJ IDEA (Recommended for Backend)

**Setup**:
1. Open `server` directory as Maven project
2. Install Lombok plugin
3. Enable annotation processing
4. Configure Java SDK 17

**Useful Plugins**:
- Lombok
- SonarLint
- CheckStyle-IDEA
- Spring Boot Assistant

#### VS Code (Recommended for Frontend)

**Extensions**:
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "dsznajder.es7-react-js-snippets",
    "formulahendry.auto-rename-tag"
  ]
}
```

**Settings** (`.vscode/settings.json`):
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.validate": ["javascript", "javascriptreact"]
}
```

### Database Tools

- **pgAdmin**: GUI for PostgreSQL
- **DBeaver**: Universal database tool
- **DataGrip**: JetBrains database IDE

### API Testing

- **Postman**: Import collection from `server/Documentation/Postman_Collection.json`
- **Insomnia**: Alternative REST client
- **curl**: Command-line testing

## Code Structure

### Backend Structure

```
server/src/main/java/com/skywalker/backend/
├── config/           # Configuration classes
│   ├── SecurityConfig.java
│   └── CorsConfig.java
├── controller/       # REST controllers
│   ├── AuthController.java
│   ├── UserController.java
│   ├── DoctorController.java
│   ├── PatientController.java
│   └── AppointmentController.java
├── domain/           # Enums and constants
│   ├── USER_ROLE.java
│   ├── GENDER.java
│   └── STATUS.java
├── dto/              # Data Transfer Objects
│   ├── UserDTO.java
│   ├── DoctorDTO.java
│   ├── PatientDTO.java
│   └── AppointmentDTO.java
├── exception/        # Exception handling
│   ├── OurException.java
│   └── RestExceptionHandler.java
├── model/            # JPA entities
│   ├── User.java
│   ├── Doctor.java
│   ├── Patient.java
│   └── Appointment.java
├── repository/       # Data repositories
│   ├── UserRepository.java
│   ├── DoctorRepository.java
│   ├── PatientRepository.java
│   └── AppointmentRepository.java
├── security/         # Security components
│   ├── JwtService.java
│   └── JwtAuthFilter.java
└── service/          # Business logic
    ├── repo/         # Service interfaces
    └── impl/         # Service implementations
```

### Frontend Structure

```
client/src/
├── components/       # Reusable components
├── contexts/         # Context providers
├── pages/            # Page components
├── services/         # API services
├── App.js            # Main app component
└── index.js          # Entry point
```

## Coding Standards

### Java/Spring Boot Standards

#### Naming Conventions

```java
// Classes: PascalCase
public class UserService { }

// Methods: camelCase
public User findUserById(Long id) { }

// Variables: camelCase
private String userName;

// Constants: UPPER_SNAKE_CASE
private static final int MAX_ATTEMPTS = 3;

// Packages: lowercase
package com.skywalker.backend.service;
```

#### Code Style

**Class Structure Order**:
1. Static fields
2. Instance fields
3. Constructors
4. Public methods
5. Private methods

**Example**:
```java
@Service
@AllArgsConstructor
public class UserServiceImpl implements IUserService {
    
    // Dependencies
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    // Public methods
    @Override
    public User createUser(UserDTO userDTO) {
        validateUserData(userDTO);
        User user = mapToEntity(userDTO);
        return userRepository.save(user);
    }
    
    // Private helper methods
    private void validateUserData(UserDTO userDTO) {
        // Validation logic
    }
    
    private User mapToEntity(UserDTO userDTO) {
        // Mapping logic
    }
}
```

#### Exception Handling

```java
// Use custom exceptions
throw new OurException("User not found with id: " + id);

// Handle exceptions in controller
@RestControllerAdvice
public class RestExceptionHandler {
    
    @ExceptionHandler(OurException.class)
    public ResponseEntity<ErrorResponse> handleOurException(OurException ex) {
        ErrorResponse error = new ErrorResponse(400, ex.getMessage());
        return ResponseEntity.badRequest().body(error);
    }
}
```

#### Documentation

```java
/**
 * Creates a new user in the system.
 *
 * @param userDTO the user data transfer object
 * @return the created user
 * @throws OurException if email already exists
 */
public User createUser(UserDTO userDTO) {
    // Implementation
}
```

### JavaScript/React Standards

#### Naming Conventions

```javascript
// Components: PascalCase
function UserProfile() { }

// Functions: camelCase
function fetchUserData() { }

// Variables: camelCase
const userName = 'John';

// Constants: UPPER_SNAKE_CASE
const API_BASE_URL = 'http://localhost:8080';

// Files: PascalCase for components, camelCase for utilities
UserProfile.js
authService.js
```

#### Component Structure

```javascript
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserData } from '../services/userService';
import LoadingSpinner from '../components/common/LoadingSpinner';

/**
 * User profile page component
 */
function UserProfile() {
  // State
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Hooks
  const navigate = useNavigate();
  
  // Effects
  useEffect(() => {
    fetchUser();
  }, []);
  
  // Event handlers
  const handleEdit = () => {
    navigate('/profile/edit');
  };
  
  // Helper functions
  const fetchUser = async () => {
    try {
      const data = await getUserData();
      setUser(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Render logic
  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h1>{user.name}</h1>
      <button onClick={handleEdit}>Edit Profile</button>
    </div>
  );
}

export default UserProfile;
```

#### Code Style

**Use ES6+ features**:
```javascript
// Arrow functions
const handleClick = () => { };

// Destructuring
const { name, email } = user;

// Spread operator
const newUser = { ...user, name: 'Updated' };

// Template literals
const message = `Hello, ${name}!`;

// Async/await
const data = await fetchData();
```

## Git Workflow

### Branch Naming

```
feature/description    # New features
bugfix/description     # Bug fixes
hotfix/description     # Urgent fixes
refactor/description   # Code refactoring
docs/description       # Documentation
```

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance

**Examples**:
```bash
feat(auth): add JWT token refresh mechanism

Implemented automatic token refresh when token expires.
Added refresh token endpoint and client-side logic.

Closes #123

---

fix(appointment): prevent booking in past dates

Added validation to ensure appointment date is in future.

Fixes #456
```

### Workflow Steps

1. **Create Branch**
   ```bash
   git checkout -b feature/user-notifications
   ```

2. **Make Changes**
   ```bash
   # Edit files
   git add .
   git commit -m "feat(notifications): add email notification service"
   ```

3. **Keep Updated**
   ```bash
   git fetch origin
   git rebase origin/main
   ```

4. **Push Changes**
   ```bash
   git push origin feature/user-notifications
   ```

5. **Create Pull Request**
   - Go to GitHub
   - Click "New Pull Request"
   - Fill in description
   - Request reviews

6. **Address Review Comments**
   ```bash
   # Make changes
   git add .
   git commit -m "fix: address review comments"
   git push
   ```

7. **Merge**
   - Squash and merge (preferred)
   - Delete branch after merge

## Testing

### Backend Testing

#### Unit Tests

```java
@SpringBootTest
class UserServiceTest {
    
    @Mock
    private UserRepository userRepository;
    
    @InjectMocks
    private UserServiceImpl userService;
    
    @Test
    void testCreateUser_Success() {
        // Arrange
        UserDTO userDTO = new UserDTO();
        userDTO.setName("John Doe");
        userDTO.setEmail("john@example.com");
        
        User user = new User();
        user.setId(1L);
        user.setName("John Doe");
        
        when(userRepository.save(any())).thenReturn(user);
        
        // Act
        User result = userService.createUser(userDTO);
        
        // Assert
        assertNotNull(result);
        assertEquals("John Doe", result.getName());
        verify(userRepository, times(1)).save(any());
    }
}
```

#### Integration Tests

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
class UserControllerIntegrationTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    void testGetUser_Success() throws Exception {
        mockMvc.perform(get("/api/users/1")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.name").value("John Doe"));
    }
}
```

### Frontend Testing

```javascript
import { render, screen } from '@testing-library/react';
import UserProfile from './UserProfile';

test('renders user profile', () => {
  render(<UserProfile />);
  const element = screen.getByText(/User Profile/i);
  expect(element).toBeInTheDocument();
});
```

### Running Tests

**Backend**:
```bash
cd server
./mvnw test                    # Run all tests
./mvnw test -Dtest=UserServiceTest  # Run specific test
./mvnw verify                  # Run tests + integration tests
```

**Frontend**:
```bash
cd client
npm test                       # Run tests in watch mode
npm test -- --coverage         # Run with coverage report
```

## Debugging

### Backend Debugging

**IntelliJ IDEA**:
1. Set breakpoints in code
2. Run in Debug mode (Shift+F9)
3. Step through code (F8, F7)

**Command Line**:
```bash
./mvnw spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005"
```

**Logging**:
```java
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class UserService {
    public void createUser() {
        log.debug("Creating user");
        log.info("User created successfully");
        log.error("Error creating user", exception);
    }
}
```

### Frontend Debugging

**Browser DevTools**:
- Console: `console.log()`, `console.error()`
- Network: Monitor API calls
- React DevTools: Inspect components

**VS Code Debugging**:
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Debug React App",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/client/src"
    }
  ]
}
```

## Code Review Process

### Reviewer Checklist

- [ ] Code follows style guidelines
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No security vulnerabilities
- [ ] Performance considerations addressed
- [ ] Error handling is proper
- [ ] Code is readable and maintainable

### Review Comments

Use constructive feedback:
```
❌ "This is wrong"
✅ "Consider using Optional.ofNullable() to handle null values"

❌ "Bad naming"
✅ "Consider renaming 'data' to 'userData' for clarity"
```

## Contributing Guidelines

### Before Submitting PR

1. ✅ Code builds successfully
2. ✅ All tests pass
3. ✅ Code follows style guidelines
4. ✅ Commit messages are clear
5. ✅ Documentation is updated
6. ✅ No merge conflicts

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe how you tested your changes

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix/feature works
- [ ] New and existing tests pass locally
```

### Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Be patient with newcomers
- Follow project guidelines

## Resources

### Documentation
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

### Learning Resources
- [Spring Boot Tutorial](https://spring.io/guides)
- [React Tutorial](https://react.dev/learn)
- [JPA/Hibernate Guide](https://www.baeldung.com/learn-jpa-hibernate)

### Tools
- [Postman](https://www.postman.com/)
- [DBeaver](https://dbeaver.io/)
- [IntelliJ IDEA](https://www.jetbrains.com/idea/)
- [VS Code](https://code.visualstudio.com/)

## Getting Help

- **GitHub Issues**: Report bugs and request features
- **Documentation**: Check all docs files
- **Code Comments**: Read inline documentation
- **Community**: Ask questions in discussions

## Next Steps

After reviewing this guide:
1. Set up your development environment
2. Explore the codebase
3. Pick an issue to work on
4. Submit your first PR!

Happy coding! 🚀
