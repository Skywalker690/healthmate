package com.skywalker.backend.controller;

import com.skywalker.backend.dto.*;
import com.skywalker.backend.service.impl.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<Response> register(@RequestBody RegisterRequest request) {
        Response response = authService.register(request);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Response> login(@RequestBody LoginRequest loginRequest) {
        Response response = authService.login(loginRequest);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/forgot-password/request")
    public ResponseEntity<Response> requestPasswordReset(@RequestBody PasswordResetRequest request) {
        Response response = authService.requestPasswordReset(request);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/forgot-password/verify")
    public ResponseEntity<Response> verifyPasswordResetOtp(@RequestBody OtpVerificationRequest request) {
        Response response = authService.verifyPasswordResetOtp(request);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/forgot-password/reset")
    public ResponseEntity<Response> resetPasswordWithOtp(@RequestBody PasswordResetOtpRequest request) {
        Response response = authService.resetPasswordWithOtp(request);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/me/password/otp/request")
    public ResponseEntity<Response> requestPasswordChangeOtp() {
        Response response = authService.requestPasswordChangeOtp();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/me/password/otp")
    public ResponseEntity<Response> changePasswordWithOtp(@RequestBody PasswordChangeOtpRequest request) {
        Response response = authService.changePasswordWithOtp(request);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
