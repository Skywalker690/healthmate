package com.skywalker.backend.service.impl;

import com.skywalker.backend.domain.OtpPurpose;
import com.skywalker.backend.model.OtpToken;
import com.skywalker.backend.repository.OtpTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class OtpService {

    private final OtpTokenRepository otpTokenRepository;

    private static final int OTP_LENGTH = 6;
    private static final int OTP_EXPIRY_MINUTES = 5;
    private static final SecureRandom random = new SecureRandom();

    /**
     * Generate a new OTP for the given email and purpose
     */
    @Transactional
    public OtpToken generateOtp(String email, OtpPurpose purpose) {
        log.info("Generating OTP for email: {} with purpose: {}", maskEmail(email), purpose);

        // Invalidate any existing unused OTPs for this email and purpose
        invalidateExistingOtps(email, purpose);

        // Generate 6-digit OTP
        String otpCode = String.format("%06d", random.nextInt(1000000));

        OtpToken otpToken = new OtpToken();
        otpToken.setEmail(email);
        otpToken.setOtpCode(otpCode);
        otpToken.setPurpose(purpose);
        otpToken.setCreatedAt(LocalDateTime.now());
        otpToken.setExpiresAt(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES));
        otpToken.setIsUsed(false);

        OtpToken saved = otpTokenRepository.save(otpToken);
        log.info("OTP generated successfully for email: {}", maskEmail(email));
        return saved;
    }

    /**
     * Verify OTP
     */
    public boolean verifyOtp(String email, String otpCode, OtpPurpose purpose) {
        log.info("Verifying OTP for email: {} with purpose: {}", maskEmail(email), purpose);

        Optional<OtpToken> otpToken = otpTokenRepository
                .findByEmailAndOtpCodeAndPurposeAndIsUsedFalse(email, otpCode, purpose);

        if (otpToken.isEmpty()) {
            log.warn("Invalid OTP attempt for email: {}", maskEmail(email));
            return false;
        }

        OtpToken token = otpToken.get();

        // Check if expired
        if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
            log.warn("Expired OTP attempt for email: {}", maskEmail(email));
            return false;
        }

        log.info("OTP verified successfully for email: {}", maskEmail(email));
        return true;
    }

    /**
     * Mark OTP as used
     */
    @Transactional
    public void markOtpAsUsed(String email, String otpCode) {
        Optional<OtpToken> otpToken = otpTokenRepository
                .findByEmailAndOtpCodeAndIsUsedFalse(email, otpCode);

        otpToken.ifPresent(token -> {
            token.setIsUsed(true);
            token.setUsedAt(LocalDateTime.now());
            otpTokenRepository.save(token);
            log.info("OTP marked as used for email: {}", maskEmail(email));
        });
    }

    /**
     * Invalidate existing unused OTPs
     */
    @Transactional
    protected void invalidateExistingOtps(String email, OtpPurpose purpose) {
        List<OtpToken> existingOtps = otpTokenRepository
                .findByEmailAndPurposeAndIsUsedFalse(email, purpose);

        if (!existingOtps.isEmpty()) {
            existingOtps.forEach(otp -> {
                otp.setIsUsed(true);
                otp.setUsedAt(LocalDateTime.now());
            });
            otpTokenRepository.saveAll(existingOtps);
            log.info("Invalidated {} existing OTPs for email: {}", existingOtps.size(), maskEmail(email));
        }
    }

    /**
     * Cleanup expired OTPs (scheduled task)
     */
    @Transactional
    @Scheduled(cron = "0 0 * * * *") // Run every hour
    public void cleanupExpiredOtps() {
        LocalDateTime cutoffTime = LocalDateTime.now().minusHours(24);
        otpTokenRepository.deleteByCreatedAtBefore(cutoffTime);
        log.info("Cleaned up expired OTPs older than 24 hours");
    }

    /**
     * Mask email for logging
     */
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
