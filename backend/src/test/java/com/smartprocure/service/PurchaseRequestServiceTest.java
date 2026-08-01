package com.smartprocure.service;

import com.smartprocure.dto.CreatePurchaseRequestDTO;
import com.smartprocure.dto.PurchaseRequestResponseDTO;
import com.smartprocure.model.entity.Department;
import com.smartprocure.model.entity.PurchaseRequest;
import com.smartprocure.model.entity.User;
import com.smartprocure.model.enums.RequestStatus;
import com.smartprocure.model.enums.Role;
import com.smartprocure.repository.PurchaseRequestRepository;
import com.smartprocure.repository.UserRepository;
import com.smartprocure.service.impl.PurchaseRequestServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PurchaseRequestServiceTest {

    @Mock
    private PurchaseRequestRepository purchaseRequestRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private PurchaseRequestServiceImpl purchaseRequestService;

    private User employee;
    private Department department;

    @BeforeEach
    public void setUp() {
        department = new Department(1L, "Engineering", "ENG", new BigDecimal("500000.00"), null);
        employee = User.builder()
                .id(5L)
                .fullName("John Developer")
                .email("john@smartprocure.com")
                .passwordHash("hash")
                .role(Role.EMPLOYEE)
                .department(department)
                .build();
    }

    @Test
    public void testCreatePurchaseRequestSuccess() {
        CreatePurchaseRequestDTO dto = new CreatePurchaseRequestDTO("Development Laptops", "2x M3 MacBooks", "Hardware", new BigDecimal("4500.00"));

        when(userRepository.findByEmail("john@smartprocure.com")).thenReturn(Optional.of(employee));

        PurchaseRequest savedPR = PurchaseRequest.builder()
                .id(100L)
                .requestNumber("PR-20260811-A1B2")
                .title(dto.getTitle())
                .description(dto.getDescription())
                .category(dto.getCategory())
                .estimatedCost(dto.getEstimatedCost())
                .status(RequestStatus.SUBMITTED)
                .employee(employee)
                .department(department)
                .build();

        when(purchaseRequestRepository.save(any(PurchaseRequest.class))).thenReturn(savedPR);

        PurchaseRequestResponseDTO response = purchaseRequestService.createPurchaseRequest(dto, "john@smartprocure.com");

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(100L);
        assertThat(response.getStatus()).isEqualTo(RequestStatus.SUBMITTED);
        assertThat(response.getRequestNumber()).startsWith("PR-");
    }

    @Test
    public void testGetEmployeeRequestsSuccess() {
        when(userRepository.findByEmail("john@smartprocure.com")).thenReturn(Optional.of(employee));

        PurchaseRequest pr1 = PurchaseRequest.builder()
                .id(101L)
                .requestNumber("PR-20260811-0001")
                .title("Monitors")
                .category("Hardware")
                .estimatedCost(new BigDecimal("600.00"))
                .status(RequestStatus.SUBMITTED)
                .employee(employee)
                .department(department)
                .build();

        when(purchaseRequestRepository.findByEmployeeIdOrderByCreatedAtDesc(5L)).thenReturn(List.of(pr1));

        List<PurchaseRequestResponseDTO> list = purchaseRequestService.getEmployeeRequests("john@smartprocure.com");

        assertThat(list).hasSize(1);
        assertThat(list.get(0).getTitle()).isEqualTo("Monitors");
    }
}
