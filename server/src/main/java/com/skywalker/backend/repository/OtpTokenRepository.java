package com.skywalker.backend.repository;

import com.skywalker.backend.domain.OtpPurpose;
import com.skywalker.backend.model.OtpToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OtpTokenRepository extends JpaRepository<OtpToken, Long> {

    Optional<OtpToken> findByEmailAndOtpCodeAndPurposeAndIsUsedFalse(
            String email, String otpCode, OtpPurpose purpose);

    Optional<OtpToken> findByEmailAndOtpCodeAndIsUsedFalse(String email, String otpCode);

    List<OtpToken> findByEmailAndPurposeAndIsUsedFalse(String email, OtpPurpose purpose);

    void deleteByCreatedAtBefore(LocalDateTime cutoffTime);
}
