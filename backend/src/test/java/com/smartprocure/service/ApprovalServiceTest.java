package com.smartprocure.service;

import com.smartprocure.dto.ApprovalDecisionDTO;
import com.smartprocure.dto.ApprovalResponseDTO;
import com.smartprocure.exception.BadRequestException;
import com.smartprocure.model.entity.Approval;
import com.smartprocure.model.entity.Department;
import com.smartprocure.model.entity.PurchaseRequest;
import com.smartprocure.model.entity.User;
import com.smartprocure.model.enums.ApprovalAction;
import com.smartprocure.model.enums.RequestStatus;
import com.smartprocure.model.enums.Role;
import com.smartprocure.repository.ApprovalRepository;
import com.smartprocure.repository.PurchaseRequestRepository;
import com.smartprocure.repository.UserRepository;
import com.smartprocure.service.impl.ApprovalServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ApprovalServiceTest {

    @Mock
    private PurchaseRequestRepository purchaseRequestRepository;

    @Mock
    private ApprovalRepository approvalRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ApprovalServiceImpl approvalService;

    private Department department;
    private User employee;
    private User manager;
    private PurchaseRequest purchaseRequest;

    @BeforeEach
    public void setUp() {
        department = new Department(1L, "Engineering", "ENG", new BigDecimal("500000.00"), null);
        employee = User.builder().id(10L).fullName("Dev User").email("dev@smartprocure.com").role(Role.EMPLOYEE).department(department).build();
        manager = User.builder().id(20L).fullName("Manager User").email("manager@smartprocure.com").role(Role.MANAGER).department(department).build();

        purchaseRequest = PurchaseRequest.builder()
                .id(100L)
                .requestNumber("PR-20260811-001")
                .title("Cloud Infrastructure")
                .estimatedCost(new BigDecimal("1200.00"))
                .status(RequestStatus.SUBMITTED)
                .employee(employee)
                .department(department)
                .build();
    }

    @Test
    public void testApproveRequestSuccess() {
        ApprovalDecisionDTO decision = new ApprovalDecisionDTO(ApprovalAction.APPROVE, "Budget verified. Approved.");

        when(userRepository.findByEmail("manager@smartprocure.com")).thenReturn(Optional.of(manager));
        when(purchaseRequestRepository.findById(100L)).thenReturn(Optional.of(purchaseRequest));

        Approval savedApproval = Approval.builder()
                .id(1L)
                .purchaseRequest(purchaseRequest)
                .manager(manager)
                .action(ApprovalAction.APPROVE)
                .comments("Budget verified. Approved.")
                .build();

        when(approvalRepository.save(any(Approval.class))).thenReturn(savedApproval);

        ApprovalResponseDTO response = approvalService.processApprovalDecision(100L, decision, "manager@smartprocure.com");

        assertThat(response).isNotNull();
        assertThat(response.getAction()).isEqualTo(ApprovalAction.APPROVE);
        assertThat(purchaseRequest.getStatus()).isEqualTo(RequestStatus.APPROVED);
    }

    @Test
    public void testRejectWithoutCommentThrowsException() {
        ApprovalDecisionDTO decision = new ApprovalDecisionDTO(ApprovalAction.REJECT, "   ");

        when(userRepository.findByEmail("manager@smartprocure.com")).thenReturn(Optional.of(manager));
        when(purchaseRequestRepository.findById(100L)).thenReturn(Optional.of(purchaseRequest));

        assertThatThrownBy(() -> approvalService.processApprovalDecision(100L, decision, "manager@smartprocure.com"))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("mandatory when rejecting");
    }

    @Test
    public void testSelfApprovalGuardThrowsAccessDenied() {
        ApprovalDecisionDTO decision = new ApprovalDecisionDTO(ApprovalAction.APPROVE, "Self approval");

        User managerWhoIsEmployee = User.builder().id(10L).fullName("Dev User").email("dev@smartprocure.com").role(Role.MANAGER).department(department).build();
        when(userRepository.findByEmail("dev@smartprocure.com")).thenReturn(Optional.of(managerWhoIsEmployee));
        when(purchaseRequestRepository.findById(100L)).thenReturn(Optional.of(purchaseRequest));

        assertThatThrownBy(() -> approvalService.processApprovalDecision(100L, decision, "dev@smartprocure.com"))
                .isInstanceOf(AccessDeniedException.class)
                .hasMessageContaining("cannot approve or reject their own");
    }
}
