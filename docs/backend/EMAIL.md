# Email Service

## Overview

HealthMate Advanced implements an email notification system using Spring Boot's Mail service with Gmail SMTP. The system sends emails for OTP verification, password resets, appointment confirmations, and other notifications.

## Technology Stack

- **Spring Boot Mail**: Email service abstraction
- **JavaMailSender**: Core email sending interface
- **Gmail SMTP**: Email delivery service
- **MimeMessage**: HTML email support

## Configuration

### Dependencies (pom.xml)

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>
```

### Environment Variables

For production, use environment variables:

```yaml
spring:
  mail:
    host: ${MAIL_HOST:smtp.gmail.com}
    port: ${MAIL_PORT:587}
    username: ${MAIL_USERNAME}
    password: ${MAIL_PASSWORD}
```

## Gmail SMTP Setup

### 1. Enable Two-Factor Authentication

1. Go to Google Account Settings
2. Navigate to Security
3. Enable 2-Step Verification

### 2. Generate App Password

1. Go to Google Account → Security
2. Select "App passwords"
3. Generate a password for "Mail" application
4. Use this password in configuration

### 3. Enable Less Secure Apps (Alternative)

Not recommended for production:
1. Go to https://myaccount.google.com/lesssecureapps
2. Enable "Allow less secure apps"

## Email Service Implementation

### EmailService.java

```java
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    /**
     * Send OTP email for password reset
     */
    public void sendOtpEmail(String toEmail, String otp, String firstName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("HealthMate - Password Reset OTP");

            String htmlContent = buildOtpEmailTemplate(firstName, otp);
            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }

    /**
     * Send appointment confirmation email
     */
    public void sendAppointmentConfirmation(String toEmail, 
                                           String patientName,
                                           String doctorName,
                                           LocalDateTime appointmentDate,
                                           String appointmentCode) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("HealthMate - Appointment Confirmation");

            String htmlContent = buildAppointmentEmailTemplate(
                patientName, doctorName, appointmentDate, appointmentCode
            );
            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }

    /**
     * Send appointment cancellation email
     */
    public void sendAppointmentCancellation(String toEmail,
                                           String patientName,
                                           String doctorName,
                                           LocalDateTime appointmentDate) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("HealthMate - Appointment Cancelled");

            String htmlContent = buildCancellationEmailTemplate(
                patientName, doctorName, appointmentDate
            );
            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }

    /**
     * Send welcome email to new users
     */
    public void sendWelcomeEmail(String toEmail, String firstName, String role) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Welcome to HealthMate");

            String htmlContent = buildWelcomeEmailTemplate(firstName, role);
            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }

    /**
     * Build OTP email HTML template
     */
    private String buildOtpEmailTemplate(String firstName, String otp) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<style>" +
                "body { font-family: Arial, sans-serif; line-height: 1.6; }" +
                ".container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
                ".header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }" +
                ".content { background-color: #f9fafb; padding: 30px; }" +
                ".otp-box { background-color: white; border: 2px dashed #4F46E5; padding: 20px; text-align: center; margin: 20px 0; }" +
                ".otp { font-size: 32px; font-weight: bold; color: #4F46E5; letter-spacing: 5px; }" +
                ".footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" +
                "<h1>HealthMate</h1>" +
                "</div>" +
                "<div class='content'>" +
                "<h2>Hello " + firstName + ",</h2>" +
                "<p>You have requested to reset your password. Use the OTP below to proceed:</p>" +
                "<div class='otp-box'>" +
                "<div class='otp'>" + otp + "</div>" +
                "</div>" +
                "<p><strong>This OTP is valid for 10 minutes.</strong></p>" +
                "<p>If you didn't request this, please ignore this email.</p>" +
                "</div>" +
                "<div class='footer'>" +
                "<p>&copy; 2024 HealthMate. All rights reserved.</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }

    /**
     * Build appointment confirmation email template
     */
    private String buildAppointmentEmailTemplate(String patientName,
                                                 String doctorName,
                                                 LocalDateTime appointmentDate,
                                                 String appointmentCode) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM dd, yyyy 'at' hh:mm a");
        String formattedDate = appointmentDate.format(formatter);

        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<style>" +
                "body { font-family: Arial, sans-serif; line-height: 1.6; }" +
                ".container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
                ".header { background-color: #10B981; color: white; padding: 20px; text-align: center; }" +
                ".content { background-color: #f9fafb; padding: 30px; }" +
                ".appointment-details { background-color: white; border-left: 4px solid #10B981; padding: 20px; margin: 20px 0; }" +
                ".footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" +
                "<h1>✓ Appointment Confirmed</h1>" +
                "</div>" +
                "<div class='content'>" +
                "<h2>Hello " + patientName + ",</h2>" +
                "<p>Your appointment has been successfully scheduled!</p>" +
                "<div class='appointment-details'>" +
                "<p><strong>Doctor:</strong> " + doctorName + "</p>" +
                "<p><strong>Date & Time:</strong> " + formattedDate + "</p>" +
                "<p><strong>Appointment Code:</strong> " + appointmentCode + "</p>" +
                "</div>" +
                "<p>Please arrive 10 minutes early for your appointment.</p>" +
                "<p>If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>" +
                "</div>" +
                "<div class='footer'>" +
                "<p>&copy; 2024 HealthMate. All rights reserved.</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }

    /**
     * Build cancellation email template
     */
    private String buildCancellationEmailTemplate(String patientName,
                                                  String doctorName,
                                                  LocalDateTime appointmentDate) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM dd, yyyy 'at' hh:mm a");
        String formattedDate = appointmentDate.format(formatter);

        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<style>" +
                "body { font-family: Arial, sans-serif; line-height: 1.6; }" +
                ".container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
                ".header { background-color: #EF4444; color: white; padding: 20px; text-align: center; }" +
                ".content { background-color: #f9fafb; padding: 30px; }" +
                ".footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" +
                "<h1>Appointment Cancelled</h1>" +
                "</div>" +
                "<div class='content'>" +
                "<h2>Hello " + patientName + ",</h2>" +
                "<p>Your appointment has been cancelled.</p>" +
                "<p><strong>Doctor:</strong> " + doctorName + "</p>" +
                "<p><strong>Was scheduled for:</strong> " + formattedDate + "</p>" +
                "<p>If you'd like to schedule a new appointment, please visit our website.</p>" +
                "</div>" +
                "<div class='footer'>" +
                "<p>&copy; 2024 HealthMate. All rights reserved.</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }

    /**
     * Build welcome email template
     */
    private String buildWelcomeEmailTemplate(String firstName, String role) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<style>" +
                "body { font-family: Arial, sans-serif; line-height: 1.6; }" +
                ".container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
                ".header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }" +
                ".content { background-color: #f9fafb; padding: 30px; }" +
                ".footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" +
                "<h1>Welcome to HealthMate!</h1>" +
                "</div>" +
                "<div class='content'>" +
                "<h2>Hello " + firstName + ",</h2>" +
                "<p>Welcome to HealthMate! Your account has been successfully created as a " + role + ".</p>" +
                "<p>You can now log in and start using our healthcare management system.</p>" +
                "<p>If you have any questions, feel free to contact our support team.</p>" +
                "</div>" +
                "<div class='footer'>" +
                "<p>&copy; 2024 HealthMate. All rights reserved.</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }
}
```

## Usage Examples

### 1. Send OTP Email

```java
@Service
@RequiredArgsConstructor
public class OtpService {
    
    private final EmailService emailService;
    private final OtpTokenRepository otpTokenRepository;
    
    public void sendPasswordResetOtp(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new OurException("User not found"));
        
        // Generate OTP
        String otp = generateOTP();
        
        // Save to database
        OtpToken token = new OtpToken();
        token.setEmail(email);
        token.setOtp(otp);
        token.setPurpose(OtpPurpose.PASSWORD_RESET);
        token.setExpiryTime(LocalDateTime.now().plusMinutes(10));
        otpTokenRepository.save(token);
        
        // Send email
        emailService.sendOtpEmail(email, otp, user.getFirstName());
    }
}
```

### 2. Send Appointment Confirmation

```java
@Service
@RequiredArgsConstructor
public class AppointmentService {
    
    private final EmailService emailService;
    
    public Response createAppointment(Long patientId, Long doctorId, Appointment appointment) {
        // Create appointment logic...
        
        // Send confirmation emails
        emailService.sendAppointmentConfirmation(
            patient.getUser().getEmail(),
            patient.getUser().getFirstName() + " " + patient.getUser().getLastName(),
            "Dr. " + doctor.getUser().getFirstName() + " " + doctor.getUser().getLastName(),
            appointment.getAppointmentDate(),
            appointment.getAppointmentCode()
        );
        
        return response;
    }
}
```

## Email Types

### 1. OTP Emails
- **Purpose**: Password reset verification
- **Expiry**: 10 minutes
- **Template**: Blue theme with OTP box

### 2. Appointment Confirmation
- **Purpose**: Confirm scheduled appointments
- **Template**: Green theme with appointment details

### 3. Appointment Cancellation
- **Purpose**: Notify of cancelled appointments
- **Template**: Red theme with cancellation notice

### 4. Welcome Email
- **Purpose**: Welcome new users
- **Template**: Blue theme with welcome message

### 5. Appointment Reminder (Future)
- **Purpose**: Remind patients of upcoming appointments
- **Template**: Yellow/orange theme with reminder

## Error Handling

### Email Sending Failures

```java
public void sendEmailWithRetry(String toEmail, String subject, String content) {
    int maxRetries = 3;
    int retryCount = 0;
    
    while (retryCount < maxRetries) {
        try {
            sendEmail(toEmail, subject, content);
            return;
        } catch (MailException e) {
            retryCount++;
            if (retryCount >= maxRetries) {
                logger.error("Failed to send email after {} retries", maxRetries, e);
                throw new RuntimeException("Failed to send email", e);
            }
            try {
                Thread.sleep(1000 * retryCount);  // Exponential backoff
            } catch (InterruptedException ie) {
                Thread.currentThread().interrupt();
            }
        }
    }
}
```

### Logging

```java
@Slf4j
@Service
public class EmailService {
    
    public void sendOtpEmail(String toEmail, String otp, String firstName) {
        try {
            log.info("Sending OTP email to: {}", toEmail);
            // Send email...
            log.info("OTP email sent successfully to: {}", toEmail);
        } catch (MessagingException e) {
            log.error("Failed to send OTP email to: {}", toEmail, e);
            throw new RuntimeException("Failed to send email", e);
        }
    }
}
```

## Best Practices

### 1. Use HTML Templates
- Professional appearance
- Better readability
- Brand consistency

### 2. Include Unsubscribe Option
```html
<p style="font-size: 12px; color: #6b7280;">
    Don't want to receive these emails? 
    <a href="https://healthmate.com/unsubscribe">Unsubscribe</a>
</p>
```

### 3. Test Email Rendering
- Test on multiple email clients
- Use inline CSS for compatibility
- Avoid JavaScript

### 4. Rate Limiting
```java
@RateLimiter(name = "emailService")
public void sendEmail(String toEmail, String subject, String content) {
    // Send email...
}
```

### 5. Asynchronous Sending
```java
@Async
public CompletableFuture<Void> sendEmailAsync(String toEmail, String subject, String content) {
    sendEmail(toEmail, subject, content);
    return CompletableFuture.completedFuture(null);
}
```

## Alternative Email Providers

### SendGrid

```xml
<dependency>
    <groupId>com.sendgrid</groupId>
    <artifactId>sendgrid-java</artifactId>
</dependency>
```

```yaml
sendgrid:
  api-key: ${SENDGRID_API_KEY}
```

### AWS SES

```xml
<dependency>
    <groupId>com.amazonaws</groupId>
    <artifactId>aws-java-sdk-ses</artifactId>
</dependency>
```

### Mailgun

```xml
<dependency>
    <groupId>com.mailgun</groupId>
    <artifactId>mailgun-java</artifactId>
</dependency>
```

## Troubleshooting

### Common Issues

#### 1. Authentication Failed
**Solution**: Verify username and password, use app-specific password

#### 2. Connection Timeout
**Solution**: Check SMTP server and port, verify network connectivity

#### 3. Email Not Received
**Solution**: Check spam folder, verify email address, check logs

#### 4. TLS/SSL Errors
**Solution**: Ensure `starttls.enable` is true, verify Java security settings

### Debug Configuration

```yaml
logging:
  level:
    org.springframework.mail: DEBUG
```

## Security Considerations

1. **Credentials**: Store in environment variables, never commit
2. **App Passwords**: Use app-specific passwords for Gmail
3. **Rate Limiting**: Prevent abuse and spam
4. **Email Validation**: Validate email addresses before sending
5. **Content Sanitization**: Prevent injection attacks

## Future Enhancements

1. **Email Templates**: Use Thymeleaf or FreeMarker for templates
2. **Email Queue**: RabbitMQ/Kafka for reliable delivery
3. **Email Analytics**: Track open rates and clicks
4. **Attachments**: Send PDFs (prescriptions, reports)
5. **Batch Emails**: Send bulk notifications
6. **Email Preferences**: User-configurable email settings
7. **Multi-language**: Localized email templates
