package com.smartprocure.service.impl;

import com.smartprocure.dto.CreatePurchaseRequestDTO;
import com.smartprocure.dto.PurchaseRequestResponseDTO;
import com.smartprocure.exception.ResourceNotFoundException;
import com.smartprocure.model.entity.Department;
import com.smartprocure.model.entity.PurchaseRequest;
import com.smartprocure.model.entity.SlaRecord;
import com.smartprocure.model.entity.User;
import com.smartprocure.model.enums.NotificationType;
import com.smartprocure.model.enums.RequestStatus;
import com.smartprocure.model.enums.Role;
import com.smartprocure.model.enums.SlaStatus;
import com.smartprocure.repository.DepartmentRepository;
import com.smartprocure.repository.PurchaseRequestRepository;
import com.smartprocure.repository.SlaRecordRepository;
import com.smartprocure.repository.UserRepository;
import com.smartprocure.service.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PurchaseRequestServiceImpl implements PurchaseRequestService {

    private final PurchaseRequestRepository purchaseRequestRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final PriorityCalculatorService priorityCalculatorService;
    private final SlaTrackerService slaTrackerService;
    private final BudgetGovernanceService budgetGovernanceService;
    private final AuditEventService auditEventService;
    private final NotificationService notificationService;
    private final SlaRecordRepository slaRecordRepository;

    public PurchaseRequestServiceImpl(PurchaseRequestRepository purchaseRequestRepository,
                                       UserRepository userRepository,
                                       DepartmentRepository departmentRepository,
                                       PriorityCalculatorService priorityCalculatorService,
                                       SlaTrackerService slaTrackerService,
                                       BudgetGovernanceService budgetGovernanceService,
                                       AuditEventService auditEventService,
                                       NotificationService notificationService,
                                       SlaRecordRepository slaRecordRepository) {
        this.purchaseRequestRepository = purchaseRequestRepository;
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
        this.priorityCalculatorService = priorityCalculatorService;
        this.slaTrackerService = slaTrackerService;
        this.budgetGovernanceService = budgetGovernanceService;
        this.auditEventService = auditEventService;
        this.notificationService = notificationService;
        this.slaRecordRepository = slaRecordRepository;
    }

    @Override
    @Transactional
    public PurchaseRequestResponseDTO createPurchaseRequest(CreatePurchaseRequestDTO dto, String employeeEmail) {
        User employee = userRepository.findByEmailIgnoreCase(employeeEmail.trim())
                .or(() -> userRepository.findByEmail(employeeEmail))
                .orElseThrow(() -> new ResourceNotFoundException("Employee user not found with email: " + employeeEmail));

        Department dept = employee.getDepartment();
        if (dept == null) {
            dept = departmentRepository.findAll().stream().findFirst().orElse(null);
            if (dept != null) {
                employee.setDepartment(dept);
                userRepository.save(employee);
            }
        }

        String requestNumber = generateRequestNumber();

        PriorityCalculatorService.PriorityResult priority = priorityCalculatorService.calculatePriority(
                dto.getEstimatedCost(),
                dto.getUrgency(),
                java.time.LocalDateTime.now()
        );

        boolean isDraft = dto.getIsDraft() != null && dto.getIsDraft();
        RequestStatus initialStatus = isDraft ? RequestStatus.DRAFT : RequestStatus.SUBMITTED;

        PurchaseRequest request = PurchaseRequest.builder()
                .requestNumber(requestNumber)
                .title(dto.getTitle())
                .description(dto.getDescription())
                .category(dto.getCategory())
                .estimatedCost(dto.getEstimatedCost())
                .urgency(dto.getUrgency())
                .priorityLevel(priority.getLevel())
                .priorityScore(priority.getScore())
                .status(initialStatus)
                .employee(employee)
                .department(dept)
                .build();

        PurchaseRequest saved = purchaseRequestRepository.save(request);

        if (isDraft) {
            auditEventService.logEvent(saved, employee.getFullName(), employee.getRole().name(), "SAVE_DRAFT", null, RequestStatus.DRAFT.name(), "Draft request created");
        } else {
            slaTrackerService.initializeSla(saved);
            if (dept != null) {
                budgetGovernanceService.recordPendingRequest(dept, saved.getEstimatedCost());
            }
            auditEventService.logEvent(saved, employee.getFullName(), employee.getRole().name(), "CREATE_SUBMIT", null, RequestStatus.SUBMITTED.name(), "Request submitted by employee");
            notifyDepartmentManager(saved, employee, priority.getLevel().name());
        }

        return mapToResponseDTO(saved);
    }

    @Override
    @Transactional
    public PurchaseRequestResponseDTO updateDraft(Long id, CreatePurchaseRequestDTO dto, String employeeEmail) {
        User employee = userRepository.findByEmailIgnoreCase(employeeEmail.trim())
                .or(() -> userRepository.findByEmail(employeeEmail))
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + employeeEmail));

        PurchaseRequest request = purchaseRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase request not found with ID: " + id));

        if (!request.getEmployee().getId().equals(employee.getId())) {
            throw new AccessDeniedException("You are not authorized to edit this purchase request");
        }

        if (request.getStatus() != RequestStatus.DRAFT) {
            throw new com.smartprocure.exception.BadRequestException("Only draft purchase requests can be edited. Current status: " + request.getStatus());
        }

        PriorityCalculatorService.PriorityResult priority = priorityCalculatorService.calculatePriority(
                dto.getEstimatedCost(),
                dto.getUrgency(),
                java.time.LocalDateTime.now()
        );

        request.setTitle(dto.getTitle());
        request.setDescription(dto.getDescription());
        request.setCategory(dto.getCategory());
        request.setEstimatedCost(dto.getEstimatedCost());
        request.setUrgency(dto.getUrgency());
        request.setPriorityLevel(priority.getLevel());
        request.setPriorityScore(priority.getScore());

        PurchaseRequest saved = purchaseRequestRepository.save(request);
        auditEventService.logEvent(saved, employee.getFullName(), employee.getRole().name(), "UPDATE_DRAFT", RequestStatus.DRAFT.name(), RequestStatus.DRAFT.name(), "Draft details updated");

        return mapToResponseDTO(saved);
    }

    @Override
    @Transactional
    public PurchaseRequestResponseDTO submitDraft(Long id, String employeeEmail) {
        User employee = userRepository.findByEmailIgnoreCase(employeeEmail.trim())
                .or(() -> userRepository.findByEmail(employeeEmail))
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + employeeEmail));

        PurchaseRequest request = purchaseRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase request not found with ID: " + id));

        if (!request.getEmployee().getId().equals(employee.getId())) {
            throw new AccessDeniedException("You are not authorized to submit this purchase request");
        }

        if (request.getStatus() != RequestStatus.DRAFT) {
            throw new com.smartprocure.exception.BadRequestException("Only draft purchase requests can be submitted. Current status: " + request.getStatus());
        }

        request.setStatus(RequestStatus.SUBMITTED);
        PurchaseRequest saved = purchaseRequestRepository.save(request);

        slaTrackerService.initializeSla(saved);
        if (employee.getDepartment() != null) {
            budgetGovernanceService.recordPendingRequest(employee.getDepartment(), saved.getEstimatedCost());
        }

        auditEventService.logEvent(saved, employee.getFullName(), employee.getRole().name(), "SUBMIT_DRAFT", RequestStatus.DRAFT.name(), RequestStatus.SUBMITTED.name(), "Draft submitted for manager review");
        notifyDepartmentManager(saved, employee, saved.getPriorityLevel().name());

        return mapToResponseDTO(saved);
    }

    private void notifyDepartmentManager(PurchaseRequest request, User employee, String priorityLevel) {
        if (employee.getDepartment() != null) {
            userRepository.findByRole(Role.MANAGER).stream()
                    .filter(m -> m.getDepartment() != null && m.getDepartment().getId().equals(employee.getDepartment().getId()))
                    .findFirst()
                    .ifPresent(manager -> notificationService.createNotification(
                            manager,
                            "New Approval Assigned (" + priorityLevel + ")",
                            "Request " + request.getRequestNumber() + " - " + request.getTitle() + " submitted for your review.",
                            NotificationType.APPROVAL_ASSIGNED,
                            "/requests/" + request.getId()
                    ));
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<PurchaseRequestResponseDTO> getEmployeeRequests(String employeeEmail) {
        User employee = userRepository.findByEmailIgnoreCase(employeeEmail.trim())
                .or(() -> userRepository.findByEmail(employeeEmail))
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + employeeEmail));

        return purchaseRequestRepository.findByEmployeeIdOrderByCreatedAtDesc(employee.getId())
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PurchaseRequestResponseDTO getRequestById(Long id, String userEmail) {
        User user = userRepository.findByEmailIgnoreCase(userEmail.trim())
                .or(() -> userRepository.findByEmail(userEmail))
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        PurchaseRequest request = purchaseRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase request not found with ID: " + id));

        boolean isOwner = request.getEmployee() != null && request.getEmployee().getId().equals(user.getId());
        boolean isDeptManager = user.getRole() == Role.MANAGER &&
                user.getDepartment() != null && request.getDepartment() != null &&
                user.getDepartment().getId().equals(request.getDepartment().getId());

        if (!isOwner && !isDeptManager && user.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("You are not authorized to view this purchase request");
        }

        return mapToResponseDTO(request);
    }

    private String generateRequestNumber() {
        String datePrefix = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String randomSuffix = UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        return "PR-" + datePrefix + "-" + randomSuffix;
    }

    private PurchaseRequestResponseDTO mapToResponseDTO(PurchaseRequest req) {
        String employeeName = req.getEmployee() != null ? req.getEmployee().getFullName() : "N/A";
        Long employeeId = req.getEmployee() != null ? req.getEmployee().getId() : null;
        String deptName = req.getDepartment() != null ? req.getDepartment().getName() : "N/A";
        Long deptId = req.getDepartment() != null ? req.getDepartment().getId() : null;

        SlaStatus slaStatus = SlaStatus.ON_TRACK;
        java.time.LocalDateTime expectedTime = null;

        SlaRecord sla = slaRecordRepository.findByPurchaseRequestId(req.getId()).orElse(null);
        if (sla != null) {
            slaStatus = sla.getSlaStatus();
            expectedTime = sla.getExpectedApprovalTime();
        }

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
}

