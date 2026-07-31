package com.smartprocure.service;

import com.smartprocure.dto.AuthResponse;
import com.smartprocure.dto.LoginRequest;
import com.smartprocure.dto.RegisterRequest;
import com.smartprocure.dto.UserDTO;

public interface AuthService {
    AuthResponse registerUser(RegisterRequest registerRequest);
    AuthResponse authenticateUser(LoginRequest loginRequest);
    UserDTO getCurrentUserProfile(String email);
}
