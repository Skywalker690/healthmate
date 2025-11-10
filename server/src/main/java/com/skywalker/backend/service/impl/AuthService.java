package com.skywalker.backend.service.impl;

import com.skywalker.backend.domain.GENDER;
import com.skywalker.backend.domain.OtpPurpose;
import com.skywalker.backend.domain.USER_ROLE;
import com.skywalker.backend.dto.*;
import com.skywalker.backend.exception.OurException;
import com.skywalker.backend.model.Doctor;
import com.skywalker.backend.model.OtpToken;
import com.skywalker.backend.model.Patient;
import com.skywalker.backend.model.User;
import com.skywalker.backend.repository.DoctorRepository;
import com.skywalker.backend.repository.PatientRepository;
import com.skywalker.backend.repository.UserRepository;
import com.skywalker.backend.security.CustomUserDetails;
import com.skywalker.backend.security.JwtTokenProvider;
import com.skywalker.backend.service.repo.IAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class AuthService implements IAuthService {

    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

    private final OtpService otpService;
    private final EmailService emailService;

    @Transactional
    @Override
    public Response register(RegisterRequest request) {
        Response response = new Response();
        try {
            // Validate password
            if (request.getPassword() == null || request.getPassword().isBlank()) {
                throw new OurException("Password cannot be null or empty");
            }

            // Validate email
            String email = request.getEmail().trim();
            if (userRepository.existsByEmail(email)) {
                throw new OurException("Email already exists: " + email);
            }

            // Create User
            User user = new User();
            user.setName(request.getName());
            user.setEmail(email);
            user.setAddress(request.getAddress());
            user.setPhoneNumber(request.getPhoneNumber());
            user.setPassword(passwordEncoder.encode(request.getPassword()));

            // Date of birth
            if (request.getDateOfBirth() != null && !request.getDateOfBirth().isBlank()) {
                user.setDateOfBirth(LocalDate.parse(request.getDateOfBirth()));
            }

            // Gender
            try {
                user.setGender(request.getGender() != null
                        ? GENDER.valueOf(request.getGender().toUpperCase())
                        : GENDER.MALE);
            } catch (IllegalArgumentException ex) {
                throw new OurException("Invalid gender value: " + request.getGender());
            }

            // Role
            user.setRole(request.getRole() != null ? request.getRole() : USER_ROLE.ROLE_PATIENT);

            User savedUser = userRepository.save(user);

            // Create Patient or Doctor entity
            if (savedUser.getRole() == USER_ROLE.ROLE_PATIENT) {
                Patient patient = new Patient();
                patient.setUser(savedUser);
                patientRepository.save(patient);
            } else if (savedUser.getRole() == USER_ROLE.ROLE_DOCTOR) {
                Doctor doctor = new Doctor();
                doctor.setUser(savedUser);
                doctor.setExperience(request.getExperience());
                doctor.setAvailableHours(request.getAvailableHours());
                doctor.setSpecialization(request.getSpecialization() != null ? request.getSpecialization() : "General");
                doctorRepository.save(doctor);
            }

            response.setStatusCode(200);
            response.setMessage("User registered successfully");

        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred during user registration: " + e.getMessage());
        }

        return response;
    }

    @Override
    public Response login(LoginRequest loginRequest) {
        Response response = new Response();
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );

            User user = userRepository.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new OurException("User not found"));

            String token = jwtTokenProvider.generateToken(user);

            response.setStatusCode(200);
            response.setToken(token);
            response.setRole(user.getRole().name());
            response.setMessage("Login successful");

        } catch (BadCredentialsException e) {
            response.setStatusCode(401);
            response.setMessage("Invalid email or password");
        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred during login: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response requestPasswordChangeOtp() {
        Response response = new Response();
        try {
            CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder
                    .getContext()
                    .getAuthentication()
                    .getPrincipal();

            User user = userRepository.findById(userDetails.getId())
                    .orElseThrow(() -> new OurException("User not found"));

            OtpToken otp = otpService.generateOtp(user.getEmail(), OtpPurpose.PASSWORD_CHANGE);
            emailService.sendOtpEmail(user.getEmail(), otp.getOtpCode(), "password change");

            response.setStatusCode(200);
            response.setMessage("OTP sent to your registered email");
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred while requesting OTP: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response changePasswordWithOtp(PasswordChangeOtpRequest request) {
        Response response = new Response();
        try {
            CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder
                    .getContext()
                    .getAuthentication()
                    .getPrincipal();

            User user = userRepository.findById(userDetails.getId())
                    .orElseThrow(() -> new OurException("User not found"));

            // Verify OTP
            if (!otpService.verifyOtp(user.getEmail(), request.getOtp(), OtpPurpose.PASSWORD_CHANGE)) {
                throw new OurException("Invalid or expired OTP");
            }

            // Change password
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            userRepository.save(user);

            // Mark OTP as used
            otpService.markOtpAsUsed(user.getEmail(), request.getOtp());

            response.setStatusCode(200);
            response.setMessage("Password changed successfully");
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred while changing password: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response requestPasswordReset(PasswordResetRequest request) {
        Response response = new Response();
        try {
            // Check if user exists
            var user = userRepository.findByEmail(request.getEmail());

            if (user.isEmpty()) {
                response.setStatusCode(404);
                response.setMessage("No account found with this email address");
                return response;
            }

            OtpToken otp = otpService.generateOtp(request.getEmail(), OtpPurpose.PASSWORD_RESET);
            emailService.sendOtpEmail(request.getEmail(), otp.getOtpCode(), "password reset");

            response.setStatusCode(200);
            response.setMessage("OTP sent to your email address");
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred while requesting password reset: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response verifyPasswordResetOtp(OtpVerificationRequest request) {
        Response response = new Response();
        try {
            boolean isValid = otpService.verifyOtp(
                    request.getEmail(),
                    request.getOtp(),
                    OtpPurpose.PASSWORD_RESET
            );

            if (!isValid) {
                throw new OurException("Invalid or expired OTP");
            }

            response.setStatusCode(200);
            response.setMessage("OTP verified successfully");
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred while verifying OTP: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response resetPasswordWithOtp(PasswordResetOtpRequest request) {
        Response response = new Response();
        try {
            // Verify OTP
            if (!otpService.verifyOtp(request.getEmail(), request.getOtp(), OtpPurpose.PASSWORD_RESET)) {
                throw new OurException("Invalid or expired OTP");
            }

            // Reset password
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new OurException("User not found"));

            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            userRepository.save(user);

            // Mark OTP as used
            otpService.markOtpAsUsed(request.getEmail(), request.getOtp());

            response.setStatusCode(200);
            response.setMessage("Password reset successfully");
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred while resetting password: " + e.getMessage());
        }
        return response;
    }
}
