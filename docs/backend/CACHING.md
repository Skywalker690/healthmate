# Caching Strategy

## Overview

HealthMate Advanced implements a Redis-based caching strategy to improve application performance by reducing database queries for frequently accessed data. The caching layer uses Spring Cache abstraction with Redis as the backend store.

## Technology Stack

- **Redis**: In-memory data structure store
- **Spring Cache**: Caching abstraction layer
- **Spring Data Redis**: Redis integration for Spring
- **Jackson**: JSON serialization for cached objects

## Redis Configuration

### Dependencies (pom.xml)

```xml
<!-- Redis for Caching -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-cache</artifactId>
</dependency>
```

### Application Configuration (application.yml)

```yaml
spring:
  data:
    redis:
      host: ${env.REDIS_HOST:localhost}
      port: ${env.REDIS_PORT:6379}
      password: ${env.REDIS_PASSWORD:}
      timeout: 60000

  cache:
    type: redis
    redis:
      time-to-live: 600000  # 10 minutes TTL (default)
```

### Redis Configuration Class

```java
@Configuration
@EnableCaching
public class RedisConfig {

    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(10))
                .serializeKeysWith(
                        RedisSerializationContext.SerializationPair
                                .fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(
                        RedisSerializationContext.SerializationPair
                                .fromSerializer(new GenericJackson2JsonRedisSerializer()));

        // Custom TTL for specific caches
        Map<String, RedisCacheConfiguration> cacheConfigurations = new HashMap<>();
        
        // Doctor directory - longer TTL (30 minutes)
        cacheConfigurations.put("doctors", 
                defaultConfig.entryTtl(Duration.ofMinutes(30)));
        
        // Dashboard stats - medium TTL (5 minutes)
        cacheConfigurations.put("dashboardStats", 
                defaultConfig.entryTtl(Duration.ofMinutes(5)));
        
        // Time slots - short TTL (2 minutes)
        cacheConfigurations.put("timeSlots", 
                defaultConfig.entryTtl(Duration.ofMinutes(2)));

        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(defaultConfig)
                .withInitialCacheConfigurations(cacheConfigurations)
                .build();
    }
}
```

## Cache Names and TTLs

| Cache Name | TTL | Purpose | Rationale |
|------------|-----|---------|-----------|
| `doctors` | 30 minutes | Doctor profiles and directory | Doctor information changes infrequently |
| `dashboardStats` | 5 minutes | Dashboard statistics | Stats update frequently but tolerate slight staleness |
| `timeSlots` | 2 minutes | Available appointment slots | Highly dynamic, needs frequent refresh |
| Default | 10 minutes | Other cacheable data | Balanced default for general use |

## Caching Annotations

### @Cacheable

Caches the result of a method. If the cache contains the result for given parameters, the method is not executed.

```java
@Cacheable(value = "doctors", key = "#id")
public Response getDoctorById(Long id) {
    // Method executes only on cache miss
    Doctor doctor = doctorRepository.findById(id)
            .orElseThrow(() -> new OurException("Doctor not found"));
    
    return Response.builder()
            .statusCode(200)
            .data(Map.of("doctor", mapToDTO(doctor)))
            .build();
}
```

**Key Generation:**
- `#id`: Uses method parameter
- `#root.methodName`: Uses method name
- `#result.field`: Uses result field
- Custom SpEL expressions

### @CacheEvict

Removes entries from the cache when data is modified.

```java
@CacheEvict(value = "doctors", key = "#id")
public Response updateDoctor(Long id, Doctor request) {
    // Update logic
    // Cache entry for this doctor is removed
}

@CacheEvict(value = "doctors", allEntries = true)
public Response deleteDoctor(Long id) {
    // Delete logic
    // All doctor cache entries are cleared
}
```

### @CachePut

Updates the cache with method result without preventing method execution.

```java
@CachePut(value = "doctors", key = "#id")
public Response updateDoctor(Long id, Doctor request) {
    // Method always executes
    // Result replaces cache entry
}
```

### @Caching

Combines multiple cache operations.

```java
@Caching(
    evict = {
        @CacheEvict(value = "doctors", key = "#id"),
        @CacheEvict(value = "dashboardStats", allEntries = true)
    }
)
public Response deleteDoctor(Long id) {
    // Evicts from multiple caches
}
```

## Cached Operations

### 1. Doctor Service

#### Get Doctor by ID
```java
@Cacheable(value = "doctors", key = "#id")
public Response getDoctorById(Long id) {
    // Cached for 30 minutes
}
```

#### Get All Doctors (Paginated)
```java
@Cacheable(value = "doctors", 
           key = "#search + '-' + #specialty + '-' + #pageable.pageNumber + '-' + #pageable.pageSize")
public Response getAllDoctorsPaginated(String search, String specialty, Pageable pageable) {
    // Complex cache key based on all parameters
}
```

#### Get Doctors by Specialization
```java
@Cacheable(value = "doctors", key = "'specialization-' + #specialization")
public Response getDoctorsBySpecialization(String specialization) {
    // Cached by specialization
}
```

#### Update Doctor
```java
@CacheEvict(value = "doctors", allEntries = true)
public Response updateDoctor(Long id, Doctor request) {
    // Clears all doctor caches on update
}
```

#### Delete Doctor
```java
@CacheEvict(value = "doctors", allEntries = true)
public Response deleteDoctor(Long id) {
    // Clears all doctor caches on delete
}
```

### 2. Dashboard Service

#### Admin Dashboard
```java
@Cacheable(value = "dashboardStats", key = "'admin-dashboard'")
public Response getAdminDashboard() {
    // Cached for 5 minutes
    // Aggregates data from multiple sources
}
```

#### Doctor Dashboard
```java
@Cacheable(value = "dashboardStats", key = "'doctor-' + #doctorId")
public Response getDoctorDashboard(Long doctorId) {
    // Cached per doctor for 5 minutes
}
```

### 3. Time Slot Service

#### Get Available Slots
```java
@Cacheable(value = "timeSlots", key = "#doctorId + '-' + #date")
public Response getAvailableSlots(Long doctorId, LocalDate date) {
    // Cached for 2 minutes
    // Short TTL due to frequent bookings
}
```

#### Book Slot (Cache Eviction)
```java
@CacheEvict(value = "timeSlots", key = "#doctorId + '-' + #date")
public Response bookTimeSlot(Long doctorId, LocalDate date, Long slotId) {
    // Evicts cache when slot is booked
}
```

## Cache Key Strategies

### 1. Simple Key
```java
@Cacheable(value = "doctors", key = "#id")
// Key: "1", "2", "3"
```

### 2. Composite Key
```java
@Cacheable(value = "timeSlots", key = "#doctorId + '-' + #date")
// Key: "1-2024-01-15", "2-2024-01-15"
```

### 3. Method-Based Key
```java
@Cacheable(value = "cache", key = "#root.methodName + '-' + #param")
// Key: "getDoctors-cardiology"
```

### 4. Custom Key Generator
```java
@Bean
public KeyGenerator customKeyGenerator() {
    return (target, method, params) -> {
        StringBuilder sb = new StringBuilder();
        sb.append(method.getName());
        for (Object param : params) {
            sb.append('-').append(param.toString());
        }
        return sb.toString();
    };
}

@Cacheable(value = "cache", keyGenerator = "customKeyGenerator")
```

## Serialization

### JSON Serialization
Redis stores data as JSON using `GenericJackson2JsonRedisSerializer`:

```java
.serializeValuesWith(
    RedisSerializationContext.SerializationPair
        .fromSerializer(new GenericJackson2JsonRedisSerializer())
)
```

**Cached Object Example:**
```json
{
  "@class": "com.skywalker.backend.dto.DoctorDTO",
  "id": 1,
  "firstName": "John",
  "lastName": "Smith",
  "specialization": "Cardiology",
  "experienceYears": 10,
  "consultationFee": 100.00
}
```

### Key Serialization
Keys are stored as strings using `StringRedisSerializer`.

## Cache Warming

Pre-populate cache on application startup:

```java
@Component
public class CacheWarmer implements ApplicationListener<ApplicationReadyEvent> {
    
    @Autowired
    private DoctorService doctorService;
    
    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        // Warm up doctor cache
        doctorService.getAllDoctorsPaginated(null, null, PageRequest.of(0, 100));
    }
}
```

## Cache Monitoring

### Redis CLI Commands

```bash
# Connect to Redis
redis-cli

# List all keys
KEYS *

# Get cache entry
GET doctors::1

# Check TTL
TTL doctors::1

# Delete specific key
DEL doctors::1

# Delete all keys
FLUSHALL

# Get cache statistics
INFO stats
```

### Monitor Cache Hit/Miss

```java
@Aspect
@Component
public class CacheLoggingAspect {
    
    private static final Logger logger = LoggerFactory.getLogger(CacheLoggingAspect.class);
    
    @Around("@annotation(cacheable)")
    public Object logCacheAccess(ProceedingJoinPoint joinPoint, Cacheable cacheable) throws Throwable {
        String cacheName = cacheable.value()[0];
        Object[] args = joinPoint.getArgs();
        
        logger.info("Accessing cache: {} with key: {}", cacheName, Arrays.toString(args));
        
        long startTime = System.currentTimeMillis();
        Object result = joinPoint.proceed();
        long executionTime = System.currentTimeMillis() - startTime;
        
        logger.info("Cache access completed in {} ms", executionTime);
        
        return result;
    }
}
```

## Best Practices

### 1. Choose Appropriate TTL
- **Frequently Updated Data**: Short TTL (1-2 minutes)
- **Moderately Updated Data**: Medium TTL (5-10 minutes)
- **Rarely Updated Data**: Long TTL (30-60 minutes)

### 2. Cache Invalidation
- **On Update**: Evict specific cache entry
- **On Delete**: Evict all related entries
- **Time-Based**: Let TTL handle expiration

### 3. Avoid Over-Caching
Don't cache:
- Highly dynamic data (real-time availability)
- User-specific sensitive data
- Large objects (> 1MB)
- Data with complex invalidation logic

### 4. Cache Key Design
- Use descriptive, consistent naming
- Include all relevant parameters
- Avoid special characters
- Keep keys reasonably short

### 5. Handle Cache Failures
```java
@Cacheable(value = "doctors", key = "#id")
public Response getDoctorById(Long id) {
    try {
        // Normal flow
    } catch (Exception e) {
        // Method executes even if caching fails
        logger.error("Cache error: ", e);
        // Fallback to database
    }
}
```

## Performance Metrics

### Expected Improvements
- **Doctor Listing**: 70-90% faster on cache hit
- **Dashboard Stats**: 80-95% faster on cache hit
- **Time Slot Queries**: 60-80% faster on cache hit

### Database Load Reduction
- **Without Cache**: Every request hits database
- **With Cache**: ~20-40% of requests hit database (depending on TTL and access patterns)

## Troubleshooting

### Common Issues

#### 1. Cache Not Working
```bash
# Check Redis connection
redis-cli ping
# Should return: PONG

# Check if keys are being created
redis-cli KEYS doctors::*
```

#### 2. Stale Data
- Verify cache eviction on updates
- Check TTL configuration
- Review cache invalidation logic

#### 3. Memory Issues
```bash
# Check Redis memory usage
redis-cli INFO memory

# Set max memory policy
CONFIG SET maxmemory 256mb
CONFIG SET maxmemory-policy allkeys-lru
```

#### 4. Serialization Errors
- Ensure DTOs are serializable
- Check for circular references
- Use `@JsonIgnore` for problematic fields

## Redis Configuration for Production

### Docker Compose
```yaml
services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    command: redis-server --appendonly yes
    environment:
      - REDIS_PASSWORD=${REDIS_PASSWORD}
    restart: unless-stopped

volumes:
  redis-data:
```

### Security
```yaml
spring:
  data:
    redis:
      host: redis-server.example.com
      port: 6379
      password: ${REDIS_PASSWORD}
      ssl: true
      timeout: 60000
```

### High Availability
- **Redis Sentinel**: Automatic failover
- **Redis Cluster**: Horizontal scaling
- **Redis Persistence**: RDB + AOF for data durability

## Future Enhancements

1. **Multi-Level Caching**: Local cache + Redis
2. **Cache Warming**: Pre-populate on startup
3. **Cache Analytics**: Track hit/miss rates
4. **Dynamic TTL**: Adjust based on access patterns
5. **Distributed Locking**: For cache updates in clustered environments
6. **Cache Compression**: Reduce memory usage for large objects
7. **Cache Versioning**: Handle schema changes gracefully
