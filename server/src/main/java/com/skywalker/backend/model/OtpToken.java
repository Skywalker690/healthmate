package com.skywalker.backend.model;

import com.skywalker.backend.domain.OtpPurpose;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "otp_tokens", indexes = {
        @Index(name = "idx_email_purpose", columnList = "email, purpose"),
        @Index(name = "idx_expires_at", columnList = "expiresAt")
})
public class OtpToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false, length = 6)
    private String otpCode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private OtpPurpose purpose;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    @Column(nullable = false)
    private Boolean isUsed = false;

    private LocalDateTime usedAt;
}
