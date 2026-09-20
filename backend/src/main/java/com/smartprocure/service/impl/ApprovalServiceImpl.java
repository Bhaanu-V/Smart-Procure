package com.smartprocure.service.impl;

import com.smartprocure.dto.ApprovalDecisionDTO;
import com.smartprocure.dto.ApprovalResponseDTO;
import com.smartprocure.dto.PurchaseRequestResponseDTO;
import com.smartprocure.exception.BadRequestException;
import com.smartprocure.exception.ResourceNotFoundException;
import com.smartprocure.model.entity.Approval;
import com.smartprocure.model.entity.PurchaseRequest;
import com.smartprocure.model.entity.SlaRecord;
import com.smartprocure.model.entity.User;
import com.smartprocure.model.enums.ApprovalAction;
import com.smartprocure.model.enums.NotificationType;
import com.smartprocure.model.enums.RequestStatus;
import com.smartprocure.model.enums.Role;
import com.smartprocure.model.enums.SlaStatus;
import com.smartprocure.repository.ApprovalRepository;
import com.smartprocure.repository.PurchaseRequestRepository;
import com.smartprocure.repository.SlaRecordRepository;
import com.smartprocure.repository.UserRepository;
import com.smartprocure.service.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApprovalServiceImpl implements ApprovalService {

    private final PurchaseRequestRepository purchaseRequestRepository;
    private final ApprovalRepository approvalRepository;
    private final UserRepository userRepository;
    private final SlaTrackerService slaTrackerService;
    private final BudgetGovernanceService budgetGovernanceService;
    private final AuditEventService auditEventService;
    private final NotificationService notificationService;
    private final SlaRecordRepository slaRecordRepository;

    public ApprovalServiceImpl(PurchaseRequestRepository purchaseRequestRepository,
                               ApprovalRepository approvalRepository,
                               UserRepository userRepository,
                               SlaTrackerService slaTrackerService,
                               BudgetGovernanceService budgetGovernanceService,
                               AuditEventService auditEventService,
                               NotificationService notificationService,
                               SlaRecordRepository slaRecordRepository) {
        this.purchaseRequestRepository = purchaseRequestRepository;
        this.approvalRepository = approvalRepository;
        this.userRepository = userRepository;
        this.slaTrackerService = slaTrackerService;
        this.budgetGovernanceService = budgetGovernanceService;
        this.auditEventService = auditEventService;
        this.notificationService = notificationService;
        this.slaRecordRepository = slaRecordRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PurchaseRequestResponseDTO> getPendingDepartmentRequests(String managerEmail) {
        User manager = userRepository.findByEmailIgnoreCase(managerEmail.trim())
                .or(() -> userRepository.findByEmail(managerEmail))
                .orElseThrow(() -> new ResourceNotFoundException("Manager user not found with email: " + managerEmail));

        // Retrieve all pending requests in SUBMITTED state for review
        List<PurchaseRequest> pendingRequests = purchaseRequestRepository.findByStatusOrderByCreatedAtDesc(RequestStatus.SUBMITTED);

        return pendingRequests.stream()
                .map(this::mapToPRResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ApprovalResponseDTO processApprovalDecision(Long requestId, ApprovalDecisionDTO decisionDTO, String managerEmail) {
        User manager = userRepository.findByEmailIgnoreCase(managerEmail.trim())
                .or(() -> userRepository.findByEmail(managerEmail))
                .orElseThrow(() -> new ResourceNotFoundException("Manager user not found with email: " + managerEmail));

        PurchaseRequest request = purchaseRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase request not found with ID: " + requestId));

        if (request.getEmployee() != null && request.getEmployee().getId().equals(manager.getId())) {
            throw new AccessDeniedException("Managers cannot approve or reject their own purchase requests");
        }

        if (request.getStatus() == RequestStatus.DRAFT || request.getStatus() == RequestStatus.CANCELLED) {
            throw new BadRequestException("Cannot review request in " + request.getStatus() + " status. Request must be submitted first.");
        }

        if (request.getStatus() == RequestStatus.APPROVED || request.getStatus() == RequestStatus.REJECTED) {
            throw new BadRequestException("This purchase request has already been finalized as " + request.getStatus());
        }

        if (decisionDTO.getAction() == ApprovalAction.REJECT && (decisionDTO.getComments() == null || decisionDTO.getComments().trim().isEmpty())) {
            throw new BadRequestException("A detailed rejection reason comment is mandatory when rejecting a purchase request");
        }

        String previousStatusStr = request.getStatus().name();

        if (decisionDTO.getAction() == ApprovalAction.APPROVE) {
            request.setStatus(RequestStatus.APPROVED);
            if (request.getDepartment() != null) {
                budgetGovernanceService.recordApproval(request.getDepartment(), request.getEstimatedCost());
            }
            if (request.getEmployee() != null) {
                notificationService.createNotification(
                        request.getEmployee(),
                        "Purchase Request Approved 🎉",
                        "Your request " + request.getRequestNumber() + " (" + request.getTitle() + ") was approved by " + manager.getFullName(),
                        NotificationType.APPROVED,
                        "/requests/" + request.getId()
                );
            }
        } else {
            request.setStatus(RequestStatus.REJECTED);
            if (request.getDepartment() != null) {
                budgetGovernanceService.releasePending(request.getDepartment(), request.getEstimatedCost());
            }
            if (request.getEmployee() != null) {
                notificationService.createNotification(
                        request.getEmployee(),
                        "Purchase Request Rejected ⚠️",
                        "Your request " + request.getRequestNumber() + " (" + request.getTitle() + ") was rejected. Reason: " + decisionDTO.getComments(),
                        NotificationType.REJECTED,
                        "/requests/" + request.getId()
                );
            }
        }
        purchaseRequestRepository.save(request);

        // Complete SLA
        slaTrackerService.markCompleted(request.getId());

        // Log Audit Event
        auditEventService.logEvent(
                request,
                manager.getFullName(),
                manager.getRole().name(),
                decisionDTO.getAction().name(),
                previousStatusStr,
                request.getStatus().name(),
                decisionDTO.getComments()
        );

        Approval approval = Approval.builder()
                .purchaseRequest(request)
                .manager(manager)
                .action(decisionDTO.getAction())
                .comments(decisionDTO.getComments())
                .build();

        Approval savedApproval = approvalRepository.save(approval);
        return mapToApprovalResponseDTO(savedApproval);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApprovalResponseDTO> getRequestApprovalHistory(Long requestId, String userEmail) {
        User user = userRepository.findByEmailIgnoreCase(userEmail.trim())
                .or(() -> userRepository.findByEmail(userEmail))
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        PurchaseRequest request = purchaseRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase request not found with ID: " + requestId));

        boolean isOwner = request.getEmployee() != null && request.getEmployee().getId().equals(user.getId());
        boolean isDeptManager = user.getRole() == Role.MANAGER &&
                user.getDepartment() != null && request.getDepartment() != null &&
                user.getDepartment().getId().equals(request.getDepartment().getId());

        if (!isOwner && !isDeptManager && user.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("Not authorized to view approval history for this request");
        }

        return approvalRepository.findByPurchaseRequestIdOrderByActionTimestampDesc(requestId)
                .stream()
                .map(this::mapToApprovalResponseDTO)
                .collect(Collectors.toList());
    }

    private PurchaseRequestResponseDTO mapToPRResponseDTO(PurchaseRequest req) {
        SlaStatus slaStatus = SlaStatus.ON_TRACK;
        java.time.LocalDateTime expectedTime = null;

        SlaRecord sla = slaRecordRepository.findByPurchaseRequestId(req.getId()).orElse(null);
        if (sla != null) {
            slaStatus = sla.getSlaStatus();
            expectedTime = sla.getExpectedApprovalTime();
        }

        Long employeeId = req.getEmployee() != null ? req.getEmployee().getId() : null;
        String employeeName = req.getEmployee() != null ? req.getEmployee().getFullName() : "N/A";
        Long deptId = req.getDepartment() != null ? req.getDepartment().getId() : null;
        String deptName = req.getDepartment() != null ? req.getDepartment().getName() : "N/A";

        return new PurchaseRequestResponseDTO(
                req.getId(),
                req.getRequestNumber(),
                req.getTitle(),
                req.getDescription(),
                req.getCategory(),
                req.getEstimatedCost(),
                req.getUrgency(),
                req.getPriorityLevel(),
                req.getPriorityScore(),
                req.getStatus(),
                employeeId,
                employeeName,
                deptId,
                deptName,
                req.getCreatedAt(),
                req.getUpdatedAt(),
                slaStatus,
                expectedTime
        );
    }

    private ApprovalResponseDTO mapToApprovalResponseDTO(Approval app) {
        return new ApprovalResponseDTO(
                app.getId(),
                app.getPurchaseRequest().getId(),
                app.getPurchaseRequest().getRequestNumber(),
                app.getManager().getId(),
                app.getManager().getFullName(),
                app.getAction(),
                app.getComments(),
                app.getActionTimestamp()
        );
    }
}

