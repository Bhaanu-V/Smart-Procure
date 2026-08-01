package com.smartprocure.service.impl;

import com.smartprocure.dto.ApprovalDecisionDTO;
import com.smartprocure.dto.ApprovalResponseDTO;
import com.smartprocure.dto.PurchaseRequestResponseDTO;
import com.smartprocure.exception.BadRequestException;
import com.smartprocure.exception.ResourceNotFoundException;
import com.smartprocure.model.entity.Approval;
import com.smartprocure.model.entity.PurchaseRequest;
import com.smartprocure.model.entity.User;
import com.smartprocure.model.enums.ApprovalAction;
import com.smartprocure.model.enums.RequestStatus;
import com.smartprocure.model.enums.Role;
import com.smartprocure.repository.ApprovalRepository;
import com.smartprocure.repository.PurchaseRequestRepository;
import com.smartprocure.repository.UserRepository;
import com.smartprocure.service.ApprovalService;
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

    public ApprovalServiceImpl(PurchaseRequestRepository purchaseRequestRepository,
                               ApprovalRepository approvalRepository,
                               UserRepository userRepository) {
        this.purchaseRequestRepository = purchaseRequestRepository;
        this.approvalRepository = approvalRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PurchaseRequestResponseDTO> getPendingDepartmentRequests(String managerEmail) {
        User manager = userRepository.findByEmail(managerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Manager user not found with email: " + managerEmail));

        if (manager.getDepartment() == null) {
            throw new BadRequestException("Manager is not assigned to any department");
        }

        Long deptId = manager.getDepartment().getId();
        List<PurchaseRequest> pendingRequests = purchaseRequestRepository.findByDepartmentIdAndStatusOrderByCreatedAtDesc(deptId, RequestStatus.SUBMITTED);

        return pendingRequests.stream()
                .map(this::mapToPRResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ApprovalResponseDTO processApprovalDecision(Long requestId, ApprovalDecisionDTO decisionDTO, String managerEmail) {
        User manager = userRepository.findByEmail(managerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Manager user not found with email: " + managerEmail));

        PurchaseRequest request = purchaseRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase request not found with ID: " + requestId));

        if (manager.getDepartment() == null || !manager.getDepartment().getId().equals(request.getDepartment().getId())) {
            throw new AccessDeniedException("You are only authorized to review purchase requests within your department");
        }

        if (request.getEmployee().getId().equals(manager.getId())) {
            throw new AccessDeniedException("Managers cannot approve or reject their own purchase requests");
        }

        if (request.getStatus() == RequestStatus.APPROVED || request.getStatus() == RequestStatus.REJECTED) {
            throw new BadRequestException("This purchase request has already been finalized as " + request.getStatus());
        }

        if (decisionDTO.getAction() == ApprovalAction.REJECT && (decisionDTO.getComments() == null || decisionDTO.getComments().trim().isEmpty())) {
            throw new BadRequestException("A detailed rejection reason comment is mandatory when rejecting a purchase request");
        }

        if (decisionDTO.getAction() == ApprovalAction.APPROVE) {
            request.setStatus(RequestStatus.APPROVED);
        } else {
            request.setStatus(RequestStatus.REJECTED);
        }
        purchaseRequestRepository.save(request);

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
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        PurchaseRequest request = purchaseRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase request not found with ID: " + requestId));

        boolean isOwner = request.getEmployee().getId().equals(user.getId());
        boolean isDeptManager = user.getRole() == Role.MANAGER &&
                user.getDepartment() != null &&
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
        return new PurchaseRequestResponseDTO(
                req.getId(),
                req.getRequestNumber(),
                req.getTitle(),
                req.getDescription(),
                req.getCategory(),
                req.getEstimatedCost(),
                req.getStatus(),
                req.getEmployee().getId(),
                req.getEmployee().getFullName(),
                req.getDepartment().getId(),
                req.getDepartment().getName(),
                req.getCreatedAt(),
                req.getUpdatedAt()
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
