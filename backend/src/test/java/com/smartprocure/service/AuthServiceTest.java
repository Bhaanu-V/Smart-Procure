package com.smartprocure.service;

import com.smartprocure.config.JwtTokenProvider;
import com.smartprocure.dto.AuthResponse;
import com.smartprocure.dto.RegisterRequest;
import com.smartprocure.exception.UserAlreadyExistsException;
import com.smartprocure.model.entity.Department;
import com.smartprocure.model.entity.User;
import com.smartprocure.model.enums.Role;
import com.smartprocure.repository.DepartmentRepository;
import com.smartprocure.repository.UserRepository;
import com.smartprocure.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private DepartmentRepository departmentRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider tokenProvider;

    @InjectMocks
    private AuthServiceImpl authService;

    private Department department;

    @BeforeEach
    public void setUp() {
        department = new Department(1L, "Engineering", "ENG", null, null);
    }

    @Test
    public void testRegisterUserSuccess() {
        RegisterRequest request = new RegisterRequest("Alice Smith", "alice@smartprocure.com", "secret123", Role.EMPLOYEE, 1L);

        when(userRepository.existsByEmail("alice@smartprocure.com")).thenReturn(false);
        when(departmentRepository.findById(1L)).thenReturn(Optional.of(department));
        when(passwordEncoder.encode("secret123")).thenReturn("encodedPassword");

        User savedUser = User.builder()
                .id(10L)
                .fullName("Alice Smith")
                .email("alice@smartprocure.com")
                .passwordHash("encodedPassword")
                .role(Role.EMPLOYEE)
                .department(department)
                .build();

        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        Authentication auth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(tokenProvider.generateToken(auth)).thenReturn("mocked.jwt.token");

        AuthResponse response = authService.registerUser(request);

        assertThat(response).isNotNull();
        assertThat(response.getToken()).isEqualTo("mocked.jwt.token");
        assertThat(response.getEmail()).isEqualTo("alice@smartprocure.com");
        assertThat(response.getRole()).isEqualTo(Role.EMPLOYEE);
    }

    @Test
    public void testRegisterUserDuplicateEmailThrowsException() {
        RegisterRequest request = new RegisterRequest("Alice Smith", "alice@smartprocure.com", "secret123", Role.EMPLOYEE, 1L);
        when(userRepository.existsByEmail("alice@smartprocure.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.registerUser(request))
                .isInstanceOf(UserAlreadyExistsException.class)
                .hasMessageContaining("Email is already registered");
    }
}
