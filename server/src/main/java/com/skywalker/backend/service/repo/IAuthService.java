package com.skywalker.backend.service.repo;

import com.skywalker.backend.dto.LoginRequest;
import com.skywalker.backend.dto.RegisterRequest;
import com.skywalker.backend.dto.Response;

public interface IAuthService {

    Response login(LoginRequest loginRequest);
    Response register(RegisterRequest request);

    // OTP-based password change
    Response requestPasswordChangeOtp();
    Response changePasswordWithOtp(com.skywalker.backend.dto.PasswordChangeOtpRequest request);

    // Forgot password
    Response requestPasswordReset(com.skywalker.backend.dto.PasswordResetRequest request);
    Response verifyPasswordResetOtp(com.skywalker.backend.dto.OtpVerificationRequest request);
    Response resetPasswordWithOtp(com.skywalker.backend.dto.PasswordResetOtpRequest request);
}
