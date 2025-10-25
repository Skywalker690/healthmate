# Troubleshooting Guide

Common issues and solutions for HealthMate application.

## Table of Contents

- [Backend Issues](#backend-issues)
- [Frontend Issues](#frontend-issues)
- [Database Issues](#database-issues)
- [Authentication Issues](#authentication-issues)
- [API Issues](#api-issues)
- [Deployment Issues](#deployment-issues)
- [Performance Issues](#performance-issues)
- [Development Environment](#development-environment)

## Backend Issues

### Server Won't Start

#### Issue: Port 8080 already in use

**Error Message**:
```
Web server failed to start. Port 8080 was already in use.
```

**Solution**:
```bash
# Find process using port 8080
# Linux/macOS:
lsof -i :8080
kill -9 <PID>

# Windows:
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Or change port in application.properties
server.port=8081
```

#### Issue: Database connection failed

**Error Message**:
```
Unable to obtain connection from database: Connection refused
```

**Solutions**:

1. **Check if PostgreSQL is running**:
```bash
# Linux:
sudo systemctl status postgresql
sudo systemctl start postgresql

# macOS:
brew services list
brew services start postgresql

# Windows:
services.msc # Check PostgreSQL service
```

2. **Verify database credentials**:
```bash
# Test connection
psql -U healthmate_user -d healthmate -h localhost

# If fails, reset password
sudo -u postgres psql
ALTER USER healthmate_user WITH PASSWORD 'newpassword';
```

3. **Check .env file location**:
```bash
# Should be in server/src/main/resources/.env
ls -la server/src/main/resources/.env

# Verify contents
cat server/src/main/resources/.env
```

4. **Check database exists**:
```bash
psql -U postgres -c "\l" | grep healthmate

# Create if missing
psql -U postgres -c "CREATE DATABASE healthmate;"
```

#### Issue: JWT secret error

**Error Message**:
```
The specified key byte array is 128 bits which is not secure enough
```

**Solution**:
Generate a secure 512-bit JWT secret:
```bash
# Generate secure secret
openssl rand -base64 64

# Update .env file
JWT_SECRET=your_generated_512_bit_secret
```

#### Issue: Lombok annotations not working

**Error Message**:
```
Cannot find symbol: method getName()
```

**Solution**:

**IntelliJ IDEA**:
1. Install Lombok plugin
2. Settings → Build → Compiler → Annotation Processors → Enable annotation processing
3. Invalidate caches and restart

**Eclipse**:
1. Download lombok.jar
2. Run `java -jar lombok.jar`
3. Point to Eclipse installation
4. Restart Eclipse

**VS Code**:
1. Install "Language Support for Java" extension
2. Configure Java extension pack

### Maven Build Fails

#### Issue: Dependencies not downloading

**Solution**:
```bash
# Clear local repository
rm -rf ~/.m2/repository

# Force update
./mvnw clean install -U

# Or specific dependency
./mvnw dependency:purge-local-repository
```

#### Issue: Tests failing during build

**Solution**:
```bash
# Skip tests temporarily
./mvnw clean install -DskipTests

# Run tests separately to debug
./mvnw test

# Run specific test
./mvnw test -Dtest=UserServiceTest
```

## Frontend Issues

### npm install fails

#### Issue: Package installation errors

**Solutions**:

1. **Clear npm cache**:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

2. **Use correct Node version**:
```bash
# Check version
node --version  # Should be 18+

# Use nvm to switch
nvm install 18
nvm use 18
```

3. **Network issues**:
```bash
# Use different registry
npm config set registry https://registry.npmjs.org/

# Or use yarn
yarn install
```

### React App Won't Start

#### Issue: Port 3000 already in use

**Error Message**:
```
Something is already running on port 3000
```

**Solution**:
```bash
# Find and kill process
# Linux/macOS:
lsof -i :3000
kill -9 <PID>

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
PORT=3001 npm start
```

#### Issue: Module not found errors

**Error Message**:
```
Module not found: Can't resolve 'axios'
```

**Solution**:
```bash
# Reinstall dependencies
rm -rf node_modules
npm install

# Or install specific package
npm install axios
```

### Build Errors

#### Issue: Out of memory during build

**Solution**:
```bash
# Increase Node memory
NODE_OPTIONS=--max_old_space_size=4096 npm run build

# Or in package.json
"scripts": {
  "build": "NODE_OPTIONS=--max_old_space_size=4096 react-scripts build"
}
```

## Database Issues

### Connection Timeouts

**Error Message**:
```
PSQLException: Connection timeout
```

**Solutions**:

1. **Increase timeout**:
```properties
spring.datasource.hikari.connection-timeout=60000
```

2. **Check connection pool**:
```properties
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
```

3. **Check database is accessible**:
```bash
# Test connection
telnet db-host 5432

# Check firewall
sudo ufw status
sudo ufw allow 5432/tcp
```

### Database Locked

**Error Message**:
```
PSQLException: database "healthmate" is being accessed by other users
```

**Solution**:
```sql
-- Terminate other connections
SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = 'healthmate'
  AND pid <> pg_backend_pid();
```

### Migration Errors

**Error Message**:
```
Schema validation failed: Table 'users' doesn't exist
```

**Solutions**:

1. **Drop and recreate database** (development only):
```sql
DROP DATABASE healthmate;
CREATE DATABASE healthmate;
```

2. **Check ddl-auto setting**:
```properties
# Development
spring.jpa.hibernate.ddl-auto=update

# Production
spring.jpa.hibernate.ddl-auto=validate
```

3. **Run migrations manually**:
```bash
./mvnw flyway:migrate
```

## Authentication Issues

### JWT Token Problems

#### Issue: Token validation fails

**Error Message**:
```
401 Unauthorized: Invalid JWT token
```

**Solutions**:

1. **Check token format**:
```javascript
// Should be: Bearer <token>
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

2. **Check token expiration**:
```javascript
// Decode token to check expiry
const decoded = jwt_decode(token);
console.log(new Date(decoded.exp * 1000));
```

3. **Verify JWT secret**:
```bash
# Backend and token must use same secret
echo $JWT_SECRET
```

#### Issue: Token expired

**Solution**:
```javascript
// Re-authenticate
const response = await axios.post('/api/auth/login', credentials);
localStorage.setItem('token', response.data.token);
```

### CORS Errors

**Error Message**:
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solutions**:

1. **Check CORS configuration**:
```java
@Bean
public WebMvcConfigurer corsConfigurer() {
    return new WebMvcConfigurer() {
        @Override
        public void addCorsMappings(CorsRegistry registry) {
            registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*")
                .allowCredentials(true);
        }
    };
}
```

2. **Check frontend API URL**:
```javascript
// .env
REACT_APP_API_URL=http://localhost:8080
```

3. **Verify preflight requests**:
```bash
# Test OPTIONS request
curl -X OPTIONS http://localhost:8080/api/users \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET" \
  -v
```

## API Issues

### 404 Not Found

**Solutions**:

1. **Check API endpoint**:
```bash
# Backend logs show registered mappings
# Look for: Mapped "{[/api/users]}"
```

2. **Verify controller mapping**:
```java
@RestController
@RequestMapping("/api/users")  // Check this matches
public class UserController {
    @GetMapping  // Results in /api/users
    public ResponseEntity<?> getUsers() { }
}
```

3. **Check base URL**:
```javascript
// Frontend service
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
```

### 500 Internal Server Error

**Solutions**:

1. **Check backend logs**:
```bash
# Look for stack traces
tail -f logs/spring.log
```

2. **Enable debug logging**:
```properties
logging.level.com.skywalker.backend=DEBUG
logging.level.org.springframework.web=DEBUG
```

3. **Check exception handling**:
```java
// Ensure @RestControllerAdvice is handling exceptions
@RestControllerAdvice
public class RestExceptionHandler {
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleException(Exception ex) {
        log.error("Error occurred", ex);
        return ResponseEntity.status(500).body("Internal Server Error");
    }
}
```

### 400 Bad Request

**Solutions**:

1. **Check request payload**:
```javascript
// Ensure JSON is valid
const userData = {
  name: "John Doe",
  email: "john@example.com",
  // All required fields
};
```

2. **Check validation annotations**:
```java
@NotBlank(message = "Name is required")
private String name;
```

3. **Check date format**:
```javascript
// Use ISO format
dateOfBirth: "1990-01-15"  // YYYY-MM-DD
```

## Deployment Issues

### Docker Build Fails

**Solutions**:

1. **Check Dockerfile path**:
```bash
docker build -t healthmate-backend -f server/Dockerfile ./server
```

2. **Clear Docker cache**:
```bash
docker builder prune
docker build --no-cache -t healthmate-backend ./server
```

3. **Check disk space**:
```bash
df -h
docker system df
docker system prune -a
```

### Container Won't Start

**Solutions**:

1. **Check logs**:
```bash
docker logs healthmate-backend
docker logs -f healthmate-backend  # Follow logs
```

2. **Check environment variables**:
```bash
docker inspect healthmate-backend | grep -A 20 Env
```

3. **Access container shell**:
```bash
docker exec -it healthmate-backend /bin/sh
```

### Database Connection in Docker

**Solution**:
```yaml
# docker-compose.yml
services:
  backend:
    environment:
      # Use service name as host
      DB_URL: jdbc:postgresql://database:5432/healthmate
```

## Performance Issues

### Slow API Responses

**Solutions**:

1. **Add database indexes**:
```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);
```

2. **Optimize queries**:
```java
// Use pagination
@Query("SELECT u FROM User u")
Page<User> findAll(Pageable pageable);
```

3. **Enable connection pooling**:
```properties
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5
```

4. **Add caching**:
```java
@Cacheable("users")
public User getUserById(Long id) {
    return userRepository.findById(id).orElseThrow();
}
```

### High Memory Usage

**Solutions**:

1. **Adjust JVM memory**:
```bash
java -Xms512m -Xmx2048m -jar app.jar
```

2. **Monitor memory**:
```bash
# JVM memory
jstat -gc <pid>

# Container memory
docker stats
```

3. **Profile application**:
```bash
# Use VisualVM or JProfiler
jvisualvm
```

## Development Environment

### IDE Issues

#### IntelliJ IDEA

**Problem**: Changes not reflected

**Solution**:
1. Build → Rebuild Project
2. File → Invalidate Caches / Restart
3. Check Spring Boot DevTools is included

**Problem**: Cannot resolve symbols

**Solution**:
1. File → Project Structure → Check SDK
2. Maven → Reimport
3. Enable annotation processing

#### VS Code

**Problem**: Java extension not working

**Solution**:
```bash
# Clean Java workspace
Cmd/Ctrl + Shift + P → Java: Clean Java Language Server Workspace
```

### Git Issues

**Problem**: Merge conflicts

**Solution**:
```bash
# View conflicts
git status

# Open files and resolve markers
# <<<<<<< HEAD
# Your changes
# =======
# Their changes
# >>>>>>>

# After resolving
git add .
git commit -m "Resolve merge conflicts"
```

**Problem**: Accidentally committed sensitive data

**Solution**:
```bash
# Remove from history (use with caution)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch path/to/file" \
  --prune-empty --tag-name-filter cat -- --all

# Or use BFG Repo-Cleaner
bfg --delete-files .env
```

## Common Error Messages

### "Could not find or load main class"

**Cause**: Classpath issue or JAR not built properly

**Solution**:
```bash
./mvnw clean package
java -jar target/healthmate-0.0.1-SNAPSHOT.jar
```

### "Access Denied" in database

**Cause**: User lacks permissions

**Solution**:
```sql
GRANT ALL PRIVILEGES ON DATABASE healthmate TO healthmate_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO healthmate_user;
```

### "Network error" in frontend

**Cause**: Backend not accessible

**Solution**:
1. Check backend is running: `curl http://localhost:8080/actuator/health`
2. Check CORS configuration
3. Check firewall/network settings

## Getting More Help

If issues persist:

1. **Check Logs**:
   - Backend: `logs/spring.log`
   - Frontend: Browser console (F12)
   - Database: PostgreSQL logs

2. **Enable Debug Mode**:
   ```properties
   logging.level.root=DEBUG
   ```

3. **Search GitHub Issues**:
   - [GitHub Issues](https://github.com/Skywalker690/Healthmate1/issues)

4. **Community Support**:
   - Stack Overflow with tag `healthmate`
   - GitHub Discussions

5. **Contact Support**:
   - Open a GitHub issue
   - Provide:
     - Error message
     - Steps to reproduce
     - Environment details
     - Log files

## Debugging Tips

### Backend Debugging

```java
// Add logging
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class UserService {
    public void method() {
        log.debug("Debug info: {}", variable);
        log.info("Info message");
        log.error("Error occurred", exception);
    }
}
```

### Frontend Debugging

```javascript
// Console logging
console.log('State:', state);
console.table(array);
console.trace();

// React DevTools
// Install browser extension

// Network tab
// Monitor API calls in browser DevTools
```

### Database Debugging

```sql
-- Check slow queries
SELECT * FROM pg_stat_statements 
ORDER BY total_time DESC 
LIMIT 10;

-- Check active connections
SELECT * FROM pg_stat_activity;

-- Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## Prevention Best Practices

1. **Use version control properly**
   - Commit frequently
   - Write clear commit messages
   - Create branches for features

2. **Test before deploying**
   - Run all tests
   - Test in staging environment
   - Load testing for performance

3. **Monitor in production**
   - Set up alerts
   - Monitor logs
   - Track metrics

4. **Keep dependencies updated**
   - Regular updates
   - Security patches
   - Check for vulnerabilities

5. **Document changes**
   - Update documentation
   - Comment complex code
   - Keep changelog

## Conclusion

Most issues can be resolved by:
- Checking logs
- Verifying configuration
- Testing connections
- Reading error messages carefully

For more information, see:
- [INSTALLATION.md](INSTALLATION.md) for setup issues
- [DEVELOPMENT.md](DEVELOPMENT.md) for development issues
- [DEPLOYMENT.md](DEPLOYMENT.md) for deployment issues
- [SECURITY.md](SECURITY.md) for security issues
