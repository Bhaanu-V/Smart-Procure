package com.smartprocure.controller;

import com.smartprocure.dto.AuthResponse;
import com.smartprocure.dto.LoginRequest;
import com.smartprocure.dto.RegisterRequest;
import com.smartprocure.dto.UserDTO;
import com.smartprocure.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/api/v1/auth", "/api/auth"})
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        AuthResponse response = authService.registerUser(registerRequest);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        AuthResponse response = authService.authenticateUser(loginRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-email")
    public ResponseEntity<String> verifyEmail(
            @RequestParam(value = "token", required = false) String paramToken,
            @RequestBody(required = false) java.util.Map<String, String> body) {
        String token = paramToken;
        if ((token == null || token.isEmpty()) && body != null) {
            token = body.get("token");
        }
        if (token == null || token.trim().isEmpty()) {
            throw new com.smartprocure.exception.BadRequestException("Verification token is required");
        }
        authService.verifyEmail(token.trim());
        return ResponseEntity.ok("Email address verified successfully.");
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<String> resendVerification(@RequestBody java.util.Map<String, String> body) {
        String email = body != null ? body.get("email") : null;
        if (email == null || email.trim().isEmpty()) {
            throw new com.smartprocure.exception.BadRequestException("Email address is required");
        }
        authService.resendVerificationToken(email.trim());
        return ResponseEntity.ok("Verification email resent successfully.");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<java.util.Map<String, String>> forgotPassword(@Valid @RequestBody com.smartprocure.dto.ForgotPasswordRequest request) {
        String token = authService.forgotPassword(request.getEmail());
        java.util.Map<String, String> response = new java.util.HashMap<>();
        response.put("message", "Password reset instructions generated successfully.");
        response.put("token", token);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody com.smartprocure.dto.ResetPasswordRequest request) {
        authService.resetPassword(request.getToken(), request.getNewPassword());
        return ResponseEntity.ok("Password has been reset successfully. You can now log in with your new password.");
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        UserDTO userDTO = authService.getCurrentUserProfile(userDetails.getUsername());
        return ResponseEntity.ok(userDTO);
    }
}
