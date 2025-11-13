# WebSocket & Real-Time Communication

## Overview

HealthMate Advanced uses WebSocket technology with the STOMP protocol for real-time, bidirectional communication between the server and clients. This enables instant notification delivery and live updates without polling.

## Technology Stack

- **Spring WebSocket**: Core WebSocket support
- **STOMP Protocol**: Simple Text Oriented Messaging Protocol over WebSocket
- **SockJS**: WebSocket fallback for browsers that don't support WebSocket
- **Spring Messaging**: Message broker and template for sending messages

## WebSocket Configuration

### Server Configuration (`WebSocketConfig.java`)

```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Enable a simple in-memory message broker
        config.enableSimpleBroker("/topic", "/queue");
        // Prefix for messages from clients
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Register STOMP endpoint with SockJS fallback
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }
}
```

### Key Configuration Elements

1. **Endpoint**: `/ws`
   - Entry point for WebSocket connections
   - SockJS fallback enabled for compatibility

2. **Message Broker Destinations**:
   - `/topic`: For broadcasting to multiple subscribers (publish-subscribe)
   - `/queue`: For point-to-point messaging (user-specific)

3. **Application Prefix**: `/app`
   - Prefix for client-to-server messages
   - Messages sent to `/app/...` are routed to `@MessageMapping` methods

## Connection Flow

### 1. Client Connection

```javascript
// Using SockJS and STOMP
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const socket = new SockJS('http://localhost:8080/ws');
const stompClient = new Client({
  webSocketFactory: () => socket,
  debug: (str) => console.log(str),
  reconnectDelay: 5000,
  heartbeatIncoming: 4000,
  heartbeatOutgoing: 4000
});
```

### 2. Connection Establishment

```javascript
stompClient.onConnect = (frame) => {
  console.log('Connected: ' + frame);
  
  // Subscribe to notifications
  stompClient.subscribe('/user/queue/notifications', (notification) => {
    const message = JSON.parse(notification.body);
    console.log('Received notification:', message);
    // Handle notification (show toast, update UI, etc.)
  });
};

stompClient.activate();
```

### 3. Disconnection

```javascript
stompClient.onDisconnect = () => {
  console.log('Disconnected');
};

// Manual disconnect
stompClient.deactivate();
```

## Notification System

### Server-Side Implementation

The `NotificationService` handles sending notifications to users:

```java
@Service
@RequiredArgsConstructor
public class NotificationService {
    
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;
    
    @Transactional
    public void sendNotification(Long userId, String message) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return;
        }

        // 1. Save notification to database
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(message);
        notification.setIsRead(false);
        notificationRepository.save(notification);

        // 2. Send real-time notification via WebSocket
        NotificationDTO dto = mapToDTO(notification);
        messagingTemplate.convertAndSendToUser(
            user.getEmail(),  // User identifier
            "/queue/notifications",  // Destination
            dto  // Message payload
        );
    }
}
```

### Client-Side Subscription

```javascript
// Subscribe to user-specific notifications
// User email: user@example.com
stompClient.subscribe('/user/queue/notifications', (message) => {
  const notification = JSON.parse(message.body);
  
  // Notification object structure
  console.log({
    id: notification.id,
    userId: notification.userId,
    message: notification.message,
    isRead: notification.isRead,
    timestamp: notification.timestamp
  });
  
  // Display notification to user
  displayNotification(notification);
});
```

## Message Types

### 1. User-Specific Messages (`/user/queue/...`)

Used for sending messages to a specific user:

```java
// Send to specific user
messagingTemplate.convertAndSendToUser(
    userEmail,
    "/queue/notifications",
    notificationDTO
);
```

Client subscribes to:
```javascript
stompClient.subscribe('/user/queue/notifications', handler);
```

### 2. Broadcast Messages (`/topic/...`)

Used for broadcasting to all subscribers (not currently used but available):

```java
// Broadcast to all subscribers
messagingTemplate.convertAndSend(
    "/topic/announcements",
    announcement
);
```

Client subscribes to:
```javascript
stompClient.subscribe('/topic/announcements', handler);
```

## Use Cases

### 1. Appointment Notifications

When an appointment is created, updated, or cancelled:

```java
// In AppointmentService
public Response createAppointment(Long patientId, Long doctorId, Appointment appointment) {
    // ... appointment creation logic ...
    
    // Notify patient
    notificationService.sendNotification(
        patientId,
        "Your appointment with Dr. " + doctor.getUser().getFirstName() + 
        " is scheduled for " + appointment.getAppointmentDate()
    );
    
    // Notify doctor
    notificationService.sendNotification(
        doctor.getUser().getId(),
        "New appointment scheduled with " + patient.getUser().getFirstName() +
        " on " + appointment.getAppointmentDate()
    );
    
    return response;
}
```

### 2. Status Update Notifications

When appointment status changes:

```java
// In AppointmentService
public Response updateAppointmentStatus(Long appointmentId, STATUS status) {
    // ... status update logic ...
    
    notificationService.sendNotification(
        appointment.getPatient().getUser().getId(),
        "Your appointment status has been updated to: " + status
    );
    
    return response;
}
```

### 3. Real-Time Dashboard Updates

For live dashboard statistics (potential enhancement):

```java
// Broadcast updated statistics
messagingTemplate.convertAndSend(
    "/topic/dashboard-stats",
    dashboardStatsDTO
);
```

## Server-Sent Events (SSE) Alternative

In addition to WebSocket, the system provides an SSE endpoint for notifications:

### SSE Endpoint

```http
GET /api/notifications/stream/{userId}
```

### Server Implementation

```java
@GetMapping(value = "/stream/{userId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
public SseEmitter streamNotifications(@PathVariable Long userId) {
    SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
    
    emitter.onCompletion(() -> emitters.remove(userId));
    emitter.onTimeout(() -> emitters.remove(userId));
    emitter.onError(e -> emitters.remove(userId));
    
    emitters.put(userId, emitter);
    
    // Send initial connection confirmation
    try {
        emitter.send(SseEmitter.event()
                .name("connected")
                .data("Connected to notification stream"));
    } catch (IOException e) {
        emitter.completeWithError(e);
    }
    
    return emitter;
}
```

### Client-Side SSE Usage

```javascript
const eventSource = new EventSource(
  `http://localhost:8080/api/notifications/stream/${userId}`,
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);

eventSource.addEventListener('connected', (event) => {
  console.log('SSE Connected:', event.data);
});

eventSource.addEventListener('notification', (event) => {
  const notification = JSON.parse(event.data);
  displayNotification(notification);
});

eventSource.onerror = (error) => {
  console.error('SSE Error:', error);
  eventSource.close();
};
```

## Authentication

WebSocket connections require authentication:

### Security Configuration

```java
@Configuration
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // ...
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**", "/ws/**").permitAll()  // Allow WebSocket endpoint
                .anyRequest().authenticated()
            );
        
        return http.build();
    }
}
```

### Client-Side Authentication

```javascript
// Include JWT token in connection headers
const stompClient = new Client({
  webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
  connectHeaders: {
    Authorization: `Bearer ${jwtToken}`
  }
});
```

## Error Handling

### Connection Errors

```javascript
stompClient.onStompError = (frame) => {
  console.error('STOMP error:', frame.headers['message']);
  console.error('Error details:', frame.body);
  
  // Attempt to reconnect
  setTimeout(() => {
    stompClient.activate();
  }, 5000);
};
```

### Message Errors

```javascript
stompClient.onWebSocketError = (error) => {
  console.error('WebSocket error:', error);
};
```

## Best Practices

### 1. Connection Management

```javascript
// Create singleton connection
let stompClient = null;

export const connectWebSocket = (userId, token, onNotification) => {
  if (stompClient && stompClient.connected) {
    return stompClient;
  }
  
  const socket = new SockJS('http://localhost:8080/ws');
  stompClient = new Client({
    webSocketFactory: () => socket,
    connectHeaders: {
      Authorization: `Bearer ${token}`
    },
    onConnect: () => {
      stompClient.subscribe(
        '/user/queue/notifications',
        (message) => {
          const notification = JSON.parse(message.body);
          onNotification(notification);
        }
      );
    }
  });
  
  stompClient.activate();
  return stompClient;
};

export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }
};
```

### 2. Automatic Reconnection

```javascript
const connectWithRetry = (maxRetries = 5, delay = 5000) => {
  let retries = 0;
  
  const connect = () => {
    stompClient.onConnect = (frame) => {
      console.log('Connected successfully');
      retries = 0;  // Reset on successful connection
    };
    
    stompClient.onDisconnect = () => {
      if (retries < maxRetries) {
        retries++;
        console.log(`Reconnecting... (${retries}/${maxRetries})`);
        setTimeout(connect, delay);
      } else {
        console.error('Max reconnection attempts reached');
      }
    };
    
    stompClient.activate();
  };
  
  connect();
};
```

### 3. Heartbeat Configuration

```javascript
const stompClient = new Client({
  // ...
  heartbeatIncoming: 4000,  // Server sends heartbeat every 4 seconds
  heartbeatOutgoing: 4000,  // Client sends heartbeat every 4 seconds
});
```

### 4. Message Acknowledgment

```javascript
stompClient.subscribe('/user/queue/notifications', 
  (message) => {
    try {
      const notification = JSON.parse(message.body);
      // Process notification
      processNotification(notification);
      
      // Acknowledge receipt
      message.ack();
    } catch (error) {
      console.error('Error processing notification:', error);
      message.nack();
    }
  },
  { ack: 'client' }  // Manual acknowledgment
);
```

## Testing WebSocket

### Using Browser Console

```javascript
// Test connection
const socket = new SockJS('http://localhost:8080/ws');
const client = Stomp.over(socket);

client.connect({}, (frame) => {
  console.log('Connected:', frame);
  
  client.subscribe('/user/queue/notifications', (message) => {
    console.log('Received:', message.body);
  });
});
```

### Using Postman

Postman doesn't natively support WebSocket well, but you can use:
- **WebSocket King**: Browser extension for testing WebSocket
- **wscat**: Command-line WebSocket client
- **Browser DevTools**: Network tab shows WebSocket connections

## Performance Considerations

### 1. Connection Pooling

The in-memory message broker is suitable for single-server deployments. For scaling:

- **RabbitMQ**: For distributed message broker
- **Redis Pub/Sub**: For scaling across multiple servers
- **Apache Kafka**: For high-throughput messaging

### 2. Message Size

Keep messages small:
- Send notification IDs, not full objects
- Client fetches full details via REST API if needed

### 3. Connection Limits

Monitor concurrent WebSocket connections:
- Configure appropriate timeout values
- Implement connection limits per user
- Clean up stale connections

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Check if server is running
   - Verify endpoint URL is correct
   - Check CORS configuration

2. **Authentication Failed**
   - Verify JWT token is valid
   - Check token is included in headers
   - Ensure token hasn't expired

3. **Messages Not Received**
   - Verify subscription path is correct
   - Check user is authenticated
   - Confirm message is being sent from server

4. **Frequent Disconnections**
   - Adjust heartbeat configuration
   - Check network stability
   - Review server timeout settings

### Debug Mode

Enable debug logging:

```javascript
const stompClient = new Client({
  // ...
  debug: (str) => {
    console.log('STOMP Debug:', str);
  }
});
```

## Future Enhancements

1. **Typing Indicators**: Real-time chat features
2. **Presence Detection**: Show online/offline status
3. **Video Call Notifications**: WebRTC integration
4. **File Transfer**: Share medical documents
5. **Group Messaging**: Doctor-patient group communications
6. **Message History**: Store and retrieve message history
7. **Push Notifications**: Mobile push notification integration
8. **Read Receipts**: Track message read status
