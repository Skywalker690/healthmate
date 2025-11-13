# Authentication & Security

## Overview

HealthMate Advanced implements a comprehensive security system using Spring Security and JWT (JSON Web Tokens) for authentication and authorization. The system supports role-based access control (RBAC) with three user roles: Admin, Doctor, and Patient.

## Technology Stack

- **Spring Security**: Core security framework
- **JWT (JJWT 0.12.5)**: Token-based authentication
- **BCrypt**: Password hashing
- **Spring Method Security**: Method-level authorization

## Security Architecture

### Authentication Flow

```
1. User Registration
   ├─> Password encrypted with BCrypt
   ├─> User stored in database
   └─> Success response

2. User Login
   ├─> Credentials validation
   ├─> JWT token generation
   ├─> Token returned to client
   └─> Token expiration time provided

3. Authenticated Request
   ├─> Client includes token in Authorization header
   ├─> JwtAuthenticationFilter intercepts request
   ├─> Token validated and parsed
   ├─> Security context populated with user details
   ├─> Request proceeds to controller
   └─> Response returned to client
```

## JWT Token Structure

### Token Generation

```java
public String generateToken(UserDetails userDetails) {
    return Jwts.builder()
            .subject(userDetails.getUsername())
            .issuedAt(new Date(System.currentTimeMillis()))
            .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
            .signWith(getSigningKey())
            .compact();
}
```

### Token Components

**Header:**
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload:**
```json
{
  "sub": "user@example.com",
  "iat": 1704067200,
  "exp": 1704153600
}
```

**Signature:**
```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
```

### Token Configuration

```yaml
jwt:
  secret: "you-super-screct-string"
```

**Token Expiration:** 24 hours (configurable)

## Security Configuration

### SecurityConfig.java

```java
@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthEntryPoint unauthorizedHandler;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(request -> {
                CorsConfiguration config = new CorsConfiguration();
                config.setAllowCredentials(true);
                config.setAllowedOrigins(List.of(
                    "https://healthmate-rose.vercel.app",
                    "http://localhost:3000"
                ));
                config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
                return config;
            }))
            .exceptionHandling(ex -> ex.authenticationEntryPoint(unauthorizedHandler))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**", "/ws/**").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
}
```

### Key Security Features

1. **CSRF Protection**: Disabled (using JWT tokens)
2. **CORS**: Configured for frontend origins
3. **Public Endpoints**: `/api/auth/**`, `/ws/**`
4. **Protected Endpoints**: All others require authentication
5. **Password Encoding**: BCrypt with strength 10

## JWT Components

### 1. JwtTokenProvider

Handles JWT token operations:

```java
@Component
public class JwtTokenProvider {
    
    @Value("${jwt.secret}")
    private String jwtSecret;
    
    private static final long EXPIRATION_TIME = 86400000; // 24 hours

    // Generate token from user details
    public String generateToken(UserDetails userDetails) {
        return Jwts.builder()
                .subject(userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSigningKey())
                .compact();
    }

    // Extract username from token
    public String getUsernameFromToken(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    // Validate token
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // Get signing key
    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
```

### 2. JwtAuthenticationFilter

Intercepts and validates JWT tokens:

```java
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) 
            throws ServletException, IOException {
        
        // Extract JWT token from Authorization header
        String token = getJWTFromRequest(request);

        if (StringUtils.hasText(token) && tokenProvider.validateToken(token)) {
            // Get username from token
            String username = tokenProvider.getUsernameFromToken(token);
            
            // Load user details
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            
            // Create authentication token
            UsernamePasswordAuthenticationToken authToken = 
                new UsernamePasswordAuthenticationToken(
                    userDetails,
                    null,
                    userDetails.getAuthorities()
                );
            
            authToken.setDetails(new WebAuthenticationDetailsSource()
                    .buildDetails(request));
            
            // Set authentication in security context
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }

        filterChain.doFilter(request, response);
    }

    private String getJWTFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
```

### 3. CustomUserDetailsService

Loads user details for authentication:

```java
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        return new CustomUserDetails(user);
    }
}
```

### 4. CustomUserDetails

Implements Spring Security's UserDetails:

```java
public class CustomUserDetails implements UserDetails {

    private final User user;

    public CustomUserDetails(User user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
```

### 5. JwtAuthEntryPoint

Handles unauthorized access:

```java
@Component
public class JwtAuthEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request,
                        HttpServletResponse response,
                        AuthenticationException authException) 
            throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.getWriter().write("{\"error\": \"Unauthorized: " + 
                authException.getMessage() + "\"}");
    }
}
```

## User Roles & Permissions

### Role Hierarchy

```
ROLE_ADMIN
  ├─ Full system access
  ├─ User management (CRUD)
  ├─ Doctor management
  ├─ Patient management
  ├─ Appointment management
  └─ System statistics

ROLE_DOCTOR
  ├─ Own profile management
  ├─ Own schedule management
  ├─ View assigned appointments
  ├─ Update appointment status
  └─ View own dashboard

ROLE_PATIENT
  ├─ Own profile management
  ├─ View doctors
  ├─ Book appointments
  ├─ View own appointments
  └─ Cancel own appointments
```

### Method-Level Security

Using `@PreAuthorize` annotation:

```java
// Admin only
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public ResponseEntity<Response> getAllUsers() { }

// Admin or Doctor
@PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_DOCTOR')")
public ResponseEntity<Response> updateAppointmentStatus() { }

// Any authenticated user
@PreAuthorize("isAuthenticated()")
public ResponseEntity<Response> getCurrentUser() { }
```

## Password Security

### Password Hashing

Uses BCrypt with strength 10 (default):

```java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}

// Usage in service
String hashedPassword = passwordEncoder.encode(plainPassword);
```

### Password Validation

```java
public boolean validatePassword(String rawPassword, String encodedPassword) {
    return passwordEncoder.matches(rawPassword, encodedPassword);
}
```

### Password Requirements

Recommended (implement client-side validation):
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

## OTP-Based Security

### OTP Generation

```java
public String generateOTP() {
    Random random = new Random();
    int otp = 100000 + random.nextInt(900000);
    return String.valueOf(otp);
}
```

### OTP Storage

```java
@Entity
public class OtpToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String email;
    private String otp;
    
    @Enumerated(EnumType.STRING)
    private OtpPurpose purpose;  // PASSWORD_RESET, PASSWORD_CHANGE
    
    private LocalDateTime expiryTime;
    private boolean used;
}
```

### OTP Validation

```java
public boolean validateOtp(String email, String otp, OtpPurpose purpose) {
    Optional<OtpToken> tokenOpt = otpTokenRepository
            .findByEmailAndOtpAndPurpose(email, otp, purpose);
    
    if (tokenOpt.isEmpty()) {
        return false;
    }
    
    OtpToken token = tokenOpt.get();
    
    // Check if expired
    if (LocalDateTime.now().isAfter(token.getExpiryTime())) {
        return false;
    }
    
    // Check if already used
    if (token.isUsed()) {
        return false;
    }
    
    return true;
}
```

### OTP Expiration

- **Default Expiration**: 10 minutes
- **One-Time Use**: Token marked as used after verification
- **Purpose-Specific**: Different tokens for different purposes

## CORS Configuration

### Allowed Origins

```java
config.setAllowedOrigins(List.of(
    "https://healthmate-rose.vercel.app",  // Production
    "http://localhost:3000"                // Development
));
```

### Allowed Methods

```java
config.setAllowedMethods(List.of(
    "GET", "POST", "PUT", "DELETE", "OPTIONS"
));
```

### Allowed Headers

```java
config.setAllowedHeaders(List.of(
    "Authorization", "Content-Type"
));
```

### Credentials

```java
config.setAllowCredentials(true);
```

## Client-Side Integration

### Login Flow

```javascript
// 1. Login request
const response = await axios.post('/api/auth/login', {
  email: 'user@example.com',
  password: 'password123'
});

// 2. Store token
const token = response.data.data.token;
localStorage.setItem('token', token);

// 3. Include in subsequent requests
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

### Token Storage

**Best Practices:**
- Store in `localStorage` for persistence
- Store in `sessionStorage` for session-only
- Use `HttpOnly` cookies for enhanced security (requires backend change)

**Security Considerations:**
- Never store sensitive data in plain text
- Clear token on logout
- Validate token expiration client-side

### Logout Flow

```javascript
// 1. Clear token
localStorage.removeItem('token');
delete axios.defaults.headers.common['Authorization'];

// 2. Redirect to login
window.location.href = '/login';
```

### Token Refresh

Currently not implemented. Future enhancement:

```javascript
// Refresh token before expiration
const refreshToken = async () => {
  const response = await axios.post('/api/auth/refresh', {
    token: currentToken
  });
  
  const newToken = response.data.token;
  localStorage.setItem('token', newToken);
  axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
};
```

## Security Best Practices

### 1. Token Security

- **Strong Secret**: Use cryptographically strong secret key
- **Secure Storage**: Store secret in environment variables
- **Token Expiration**: Set reasonable expiration time (24 hours)
- **HTTPS Only**: Use HTTPS in production
- **Token Rotation**: Implement refresh tokens

### 2. Password Security

- **Strong Hashing**: BCrypt with appropriate strength
- **Salting**: Automatic with BCrypt
- **Password Policy**: Enforce strong passwords
- **Rate Limiting**: Prevent brute force attacks (to be implemented)

### 3. API Security

- **Input Validation**: Validate all inputs
- **SQL Injection**: Use parameterized queries (JPA handles this)
- **XSS Prevention**: Sanitize outputs
- **CSRF Protection**: Not needed for JWT (stateless)

### 4. Error Handling

```java
@RestControllerAdvice
public class RestExceptionHandler {

    @ExceptionHandler(OurException.class)
    public ResponseEntity<Response> handleOurException(OurException ex) {
        Response response = Response.builder()
                .statusCode(ex.getStatusCode())
                .message(ex.getMessage())
                .build();
        return ResponseEntity.status(ex.getStatusCode()).body(response);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Response> handleAccessDenied() {
        Response response = Response.builder()
                .statusCode(403)
                .message("Forbidden: Insufficient permissions")
                .build();
        return ResponseEntity.status(403).body(response);
    }
}
```

### 5. Audit Logging

```java
@Entity
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String action;
    private String entityType;
    private Long entityId;
    private Long userId;
    private LocalDateTime timestamp;
    private String details;
}

// Usage
public void logAudit(String action, String entityType, Long entityId) {
    AuditLog log = new AuditLog();
    log.setAction(action);
    log.setEntityType(entityType);
    log.setEntityId(entityId);
    log.setUserId(getCurrentUserId());
    log.setTimestamp(LocalDateTime.now());
    auditLogRepository.save(log);
}
```

## Common Security Vulnerabilities & Mitigations

### 1. SQL Injection
**Mitigation**: Using JPA with parameterized queries

### 2. XSS (Cross-Site Scripting)
**Mitigation**: Input validation, output encoding

### 3. CSRF (Cross-Site Request Forgery)
**Mitigation**: JWT tokens (stateless), CSRF disabled

### 4. Session Hijacking
**Mitigation**: HTTPS, secure token storage

### 5. Brute Force Attacks
**To Implement**: Rate limiting, account lockout

### 6. Man-in-the-Middle
**Mitigation**: HTTPS/TLS encryption

## Future Security Enhancements

1. **Refresh Tokens**: Long-lived refresh tokens for token renewal
2. **Rate Limiting**: Prevent brute force and DoS attacks
3. **Two-Factor Authentication**: Additional security layer
4. **OAuth2 Integration**: Social login (Google, Facebook)
5. **Account Lockout**: Temporary lockout after failed attempts
6. **Password History**: Prevent password reuse
7. **Session Management**: Track active sessions
8. **IP Whitelisting**: Restrict access by IP
9. **Audit Dashboard**: Real-time security monitoring
10. **Penetration Testing**: Regular security assessments
