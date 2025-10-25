# Security Documentation

Comprehensive security implementation and best practices for HealthMate.

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Authorization](#authorization)
- [Password Security](#password-security)
- [JWT Token Management](#jwt-token-management)
- [API Security](#api-security)
- [Data Security](#data-security)
- [CORS Configuration](#cors-configuration)
- [Security Best Practices](#security-best-practices)
- [Common Vulnerabilities](#common-vulnerabilities)
- [Security Checklist](#security-checklist)

## Overview

HealthMate implements multiple layers of security to protect user data and ensure secure access to the application. The security architecture follows industry best practices and OWASP guidelines.

### Security Layers

```
┌─────────────────────────────────────────┐
│         Transport Security              │
│         (HTTPS in Production)           │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      Authentication Layer               │
│      (JWT Token Validation)             │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      Authorization Layer                │
│      (Role-Based Access Control)        │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      Input Validation                   │
│      (Jakarta Validation)               │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      Business Logic                     │
└─────────────────────────────────────────┘
```

## Authentication

### JWT (JSON Web Token) Authentication

HealthMate uses JWT for stateless authentication.

#### Token Structure

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.  ← Header
eyJzdWIiOiJ1c2VyQGV4YW1wbGUuY29tIiwic...  ← Payload
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c   ← Signature
```

**Header**:
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload**:
```json
{
  "sub": "user@example.com",
  "role": "ROLE_PATIENT",
  "iat": 1609459200,
  "exp": 1609545600
}
```

#### Token Generation

```java
public String generateToken(UserDetails userDetails) {
    Map<String, Object> claims = new HashMap<>();
    return Jwts.builder()
        .setClaims(claims)
        .setSubject(userDetails.getUsername())
        .setIssuedAt(new Date(System.currentTimeMillis()))
        .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)) // 24 hours
        .signWith(getSigningKey(), SignatureAlgorithm.HS256)
        .compact();
}
```

#### Token Validation

```java
public boolean validateToken(String token, UserDetails userDetails) {
    final String username = extractUsername(token);
    return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
}
```

### Authentication Flow

```
1. User → Login (email + password)
2. Backend → Validate credentials
3. Backend → Generate JWT token
4. Backend → Return token to client
5. Client → Store token (localStorage)
6. Client → Include token in Authorization header for subsequent requests
7. Backend → Validate token on each request
8. Backend → Extract user details from token
9. Backend → Process request
```

### Login Endpoint Security

**Endpoint**: `POST /api/auth/login`

**Security Measures**:
- Password validation against BCrypt hash
- Account lockout after failed attempts (future enhancement)
- Rate limiting (recommended for production)
- IP-based throttling (recommended for production)

### Registration Endpoint Security

**Endpoint**: `POST /api/auth/register`

**Security Measures**:
- Input validation (email format, password strength)
- Duplicate email/phone check
- Password hashing with BCrypt
- Email verification (future enhancement)

## Authorization

### Role-Based Access Control (RBAC)

HealthMate implements three user roles:

| Role | Permissions |
|------|-------------|
| **ROLE_ADMIN** | Full access to all resources |
| **ROLE_DOCTOR** | Manage own profile, view assigned appointments |
| **ROLE_PATIENT** | Manage own profile, book and view own appointments |

### Spring Security Configuration

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .authorizeHttpRequests()
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/doctor/**").hasRole("DOCTOR")
                .requestMatchers("/api/patient/**").hasRole("PATIENT")
                .anyRequest().authenticated()
            .and()
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
```

### JWT Filter

```java
@Component
public class JwtAuthFilter extends OncePerRequestFilter {
    
    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) throws ServletException, IOException {
        
        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;
        
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            username = jwtService.extractUsername(token);
        }
        
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            
            if (jwtService.validateToken(token, userDetails)) {
                UsernamePasswordAuthenticationToken authToken = 
                    new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                    );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        
        filterChain.doFilter(request, response);
    }
}
```

### Method-Level Security

```java
@PreAuthorize("hasRole('ADMIN')")
public List<User> getAllUsers() {
    return userRepository.findAll();
}

@PreAuthorize("hasRole('ADMIN') or #id == authentication.principal.id")
public User getUserById(@PathVariable Long id) {
    return userRepository.findById(id).orElseThrow();
}
```

## Password Security

### BCrypt Password Hashing

**Algorithm**: BCrypt with strength 10 (default)

**Encoding Process**:
```java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}

// Usage
String hashedPassword = passwordEncoder.encode(rawPassword);
```

**Verification**:
```java
boolean matches = passwordEncoder.matches(rawPassword, hashedPassword);
```

### Password Requirements

**Current Implementation** (enforced at API level):
- Minimum 8 characters (recommended)

**Recommended for Production**:
- Minimum 12 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one digit
- At least one special character
- Not in common password dictionary

### Password Change Security

```java
@PutMapping("/users/me/password")
public ResponseEntity<?> changePassword(@RequestBody PasswordChangeRequest request) {
    // 1. Verify old password
    if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
        throw new OurException("Old password is incorrect");
    }
    
    // 2. Validate new password
    if (request.getNewPassword().length() < 8) {
        throw new OurException("Password must be at least 8 characters");
    }
    
    // 3. Hash new password
    user.setPassword(passwordEncoder.encode(request.getNewPassword()));
    
    // 4. Invalidate all existing tokens (future enhancement)
    
    return ResponseEntity.ok("Password changed successfully");
}
```

## JWT Token Management

### Token Configuration

```properties
# JWT Secret Key (256 bits minimum)
jwt.secret=${env.JWT_SECRET}

# Token expiration (in milliseconds)
jwt.expiration=86400000  # 24 hours
```

### Generating Secure JWT Secret

```bash
# Generate 512-bit (64-byte) secret
openssl rand -base64 64

# Or using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

### Token Storage

**Frontend**:
- **Development**: localStorage (convenient but vulnerable to XSS)
- **Production**: httpOnly cookies (recommended) or secure storage

**Backend**:
- Tokens are stateless (not stored)
- Token blacklist for logout (future enhancement)

### Token Expiration

- **Default**: 24 hours
- **Refresh**: Re-authenticate when expired
- **Future Enhancement**: Refresh token mechanism

### Token Revocation

**Current**: Tokens remain valid until expiration

**Future Enhancement**:
- Token blacklist in Redis
- Token versioning
- Force logout on password change

## API Security

### Input Validation

**Jakarta Validation**:
```java
public class RegisterRequest {
    
    @NotBlank(message = "Name is required")
    private String name;
    
    @Email(message = "Email should be valid")
    @NotBlank(message = "Email is required")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;
    
    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;
}
```

### SQL Injection Prevention

- **JPA/Hibernate**: Uses parameterized queries automatically
- **Never concatenate user input** into queries

**Safe**:
```java
// JPA Repository (safe)
User findByEmail(String email);

// JPQL with parameters (safe)
@Query("SELECT u FROM User u WHERE u.email = :email")
User findByEmailCustom(@Param("email") String email);
```

**Unsafe** (don't do this):
```java
// Native query with concatenation (DANGEROUS)
String query = "SELECT * FROM users WHERE email = '" + email + "'";
```

### XSS (Cross-Site Scripting) Prevention

- **Frontend**: React automatically escapes output
- **Backend**: Validate and sanitize input
- **Content-Security-Policy header** (future enhancement)

### CSRF Protection

- **Disabled for REST API** (stateless authentication)
- **Use CSRF tokens for cookie-based authentication** if implemented

```java
http.csrf().disable() // OK for JWT-based API
```

### Rate Limiting

**Recommended for Production**:
```java
@Bean
public RateLimiter rateLimiter() {
    return RateLimiter.create(10.0); // 10 requests per second
}
```

Or use external tools:
- **NGINX**: Rate limiting at reverse proxy
- **API Gateway**: AWS API Gateway, Kong, etc.

## Data Security

### Sensitive Data Handling

**Password**:
- Never returned in API responses
- `@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)`

```java
@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
private String password;
```

**Email and Phone**:
- Masked in logs
- Only visible to authorized roles

### Data Encryption

**At Rest**:
- PostgreSQL encryption (enable in production)
- Encrypted backups

**In Transit**:
- HTTPS/TLS for all communications
- Secure database connections

### Personal Data Protection (GDPR Compliance)

- User consent for data processing
- Right to data deletion
- Data export functionality (future enhancement)
- Data retention policies

## CORS Configuration

### Development Configuration

```java
@Bean
public WebMvcConfigurer corsConfigurer() {
    return new WebMvcConfigurer() {
        @Override
        public void addCorsMappings(CorsRegistry registry) {
            registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
        }
    };
}
```

### Production Configuration

```java
@Bean
public WebMvcConfigurer corsConfigurer() {
    return new WebMvcConfigurer() {
        @Override
        public void addCorsMappings(CorsRegistry registry) {
            registry.addMapping("/api/**")
                .allowedOrigins("https://yourdomain.com")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("Authorization", "Content-Type")
                .exposedHeaders("Authorization")
                .allowCredentials(true)
                .maxAge(3600);
        }
    };
}
```

## Security Best Practices

### For Development

1. ✅ Use strong JWT secrets (minimum 256 bits)
2. ✅ Never commit secrets to version control
3. ✅ Use environment variables for configuration
4. ✅ Keep dependencies up to date
5. ✅ Enable HTTPS in production
6. ✅ Implement proper error handling (don't leak system info)
7. ✅ Log security events
8. ✅ Regular security audits

### For Production

1. **Enable HTTPS**: Use TLS 1.2 or higher
2. **Use strong secrets**: Generate random 512-bit keys
3. **Implement rate limiting**: Prevent brute force attacks
4. **Enable security headers**:
   ```java
   http.headers()
       .contentSecurityPolicy("default-src 'self'")
       .and()
       .xssProtection()
       .and()
       .frameOptions().deny();
   ```
5. **Monitor and log**: Security events, failed login attempts
6. **Regular updates**: Keep all dependencies updated
7. **Penetration testing**: Regular security assessments
8. **Backup and recovery**: Encrypted backups with tested recovery

### Environment Variables

**Never hardcode**:
```java
// BAD
String jwtSecret = "mysecretkey123";
```

**Use environment variables**:
```java
// GOOD
@Value("${jwt.secret}")
private String jwtSecret;
```

## Common Vulnerabilities

### OWASP Top 10 Coverage

| Vulnerability | Protection |
|---------------|------------|
| A01: Broken Access Control | ✅ Role-based authorization |
| A02: Cryptographic Failures | ✅ BCrypt password hashing |
| A03: Injection | ✅ JPA parameterized queries |
| A04: Insecure Design | ✅ Security-first architecture |
| A05: Security Misconfiguration | ⚠️ Review production config |
| A06: Vulnerable Components | ⚠️ Regular dependency updates |
| A07: Authentication Failures | ✅ JWT authentication |
| A08: Software and Data Integrity | ✅ Input validation |
| A09: Security Logging Failures | ⚠️ Implement comprehensive logging |
| A10: Server-Side Request Forgery | ✅ Not applicable (no external requests) |

### Preventing Common Attacks

**Brute Force**:
- Implement account lockout
- Rate limiting
- CAPTCHA on login (future)

**Session Hijacking**:
- Short token expiration
- Secure token storage
- Token rotation

**Man-in-the-Middle**:
- HTTPS only
- HSTS headers
- Certificate pinning (mobile apps)

## Security Checklist

### Pre-Deployment Security Checklist

- [ ] Change all default passwords and secrets
- [ ] Generate strong JWT secret (512 bits)
- [ ] Enable HTTPS with valid SSL certificate
- [ ] Configure CORS for production domain only
- [ ] Enable database SSL connections
- [ ] Implement rate limiting
- [ ] Set up security monitoring and alerts
- [ ] Configure firewall rules
- [ ] Enable database backups
- [ ] Review and minimize error messages
- [ ] Implement logging for security events
- [ ] Test authentication and authorization
- [ ] Scan for vulnerabilities (OWASP ZAP, Burp Suite)
- [ ] Review and update dependencies
- [ ] Document security procedures
- [ ] Train team on security practices

### Regular Security Maintenance

- **Weekly**: Review security logs
- **Monthly**: Update dependencies
- **Quarterly**: Security audit and penetration testing
- **Annually**: Full security review and policy update

## Incident Response

### Security Incident Procedure

1. **Detect**: Monitor logs and alerts
2. **Contain**: Isolate affected systems
3. **Investigate**: Determine scope and impact
4. **Remediate**: Fix vulnerabilities
5. **Recover**: Restore normal operations
6. **Document**: Record incident details
7. **Review**: Post-incident analysis

### Emergency Contacts

- Development Team Lead
- Database Administrator
- System Administrator
- Legal/Compliance Team (if data breach)

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [Spring Security Documentation](https://spring.io/projects/spring-security)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

## Conclusion

Security is an ongoing process. Regular audits, updates, and monitoring are essential to maintain a secure application.

For implementation details:
- See [ARCHITECTURE.md](ARCHITECTURE.md) for system design
- See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API details
- See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
