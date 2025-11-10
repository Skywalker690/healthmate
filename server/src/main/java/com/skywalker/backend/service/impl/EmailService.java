package com.skywalker.backend.service.impl;

import com.skywalker.backend.exception.OurException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.application.name:HealthMate}")
    private String appName;

    public void sendOtpEmail(String toEmail, String otpCode, String purpose) {
        String subject = "Your OTP for " + purpose + " - " + appName;
        String body = buildOtpEmailBody(otpCode, purpose);

        sendEmail(toEmail, subject, body);
    }

    private String buildOtpEmailBody(String otpCode, String purpose) {
        return String.format("""
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
                    <h2 style="color: #007bff;">OTP Verification</h2>
                    <p>Your OTP for <strong>%s</strong> is:</p>
                    <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
                        <h1 style="color: #007bff; font-size: 36px; letter-spacing: 8px; margin: 0;">%s</h1>
                    </div>
                    <p style="color: #d9534f;"><strong>This OTP will expire in 5 minutes.</strong></p>
                    <p>If you didn't request this, please ignore this email and ensure your account is secure.</p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    <p style="font-size: 12px; color: #777;">
                        Best regards,<br>
                        <strong>%s Team</strong>
                    </p>
                </div>
            </body>
            </html>
            """, purpose, otpCode, appName);
    }

    private void sendEmail(String to, String subject, String body) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);

            mailSender.send(message);
            log.info("Email sent successfully to: {}", maskEmail(to));
        } catch (MessagingException e) {
            log.error("Failed to send email to: {}", maskEmail(to), e);
            throw new OurException("Failed to send email: " + e.getMessage());
        }
    }

    private String maskEmail(String email) {
        if (email == null || !email.contains("@")) {
            return "***";
        }
        String[] parts = email.split("@");
        if (parts[0].length() < 2) {
            return "***@" + parts[1];
        }
        return parts[0].substring(0, 2) + "***@" + parts[1];
    }
}
