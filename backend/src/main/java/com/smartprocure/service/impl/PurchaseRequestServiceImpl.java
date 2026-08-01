package com.smartprocure.service.impl;

import com.smartprocure.dto.CreatePurchaseRequestDTO;
import com.smartprocure.dto.PurchaseRequestResponseDTO;
import com.smartprocure.exception.ResourceNotFoundException;
import com.smartprocure.model.entity.PurchaseRequest;
import com.smartprocure.model.entity.User;
import com.smartprocure.model.enums.RequestStatus;
import com.smartprocure.model.enums.Role;
import com.smartprocure.repository.PurchaseRequestRepository;
import com.smartprocure.repository.UserRepository;
import com.smartprocure.service.PurchaseRequestService;
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

    public PurchaseRequestServiceImpl(PurchaseRequestRepository purchaseRequestRepository, UserRepository userRepository) {
        this.purchaseRequestRepository = purchaseRequestRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public PurchaseRequestResponseDTO createPurchaseRequest(CreatePurchaseRequestDTO dto, String employeeEmail) {
        User employee = userRepository.findByEmail(employeeEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Employee user not found with email: " + employeeEmail));

        String requestNumber = generateRequestNumber();

        PurchaseRequest request = PurchaseRequest.builder()
                .requestNumber(requestNumber)
                .title(dto.getTitle())
                .description(dto.getDescription())
                .category(dto.getCategory())
                .estimatedCost(dto.getEstimatedCost())
                .status(RequestStatus.SUBMITTED)
                .employee(employee)
                .department(employee.getDepartment())
                .build();

        PurchaseRequest saved = purchaseRequestRepository.save(request);
        return mapToResponseDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PurchaseRequestResponseDTO> getEmployeeRequests(String employeeEmail) {
        User employee = userRepository.findByEmail(employeeEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + employeeEmail));

        return purchaseRequestRepository.findByEmployeeIdOrderByCreatedAtDesc(employee.getId())
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PurchaseRequestResponseDTO getRequestById(Long id, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        PurchaseRequest request = purchaseRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase request not found with ID: " + id));

        boolean isOwner = request.getEmployee().getId().equals(user.getId());
        boolean isDeptManager = user.getRole() == Role.MANAGER &&
                user.getDepartment() != null &&
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

        return new PurchaseRequestResponseDTO(
                req.getId(),
                req.getRequestNumber(),
                req.getTitle(),
                req.getDescription(),
                req.getCategory(),
                req.getEstimatedCost(),
                req.getStatus(),
                employeeId,
                employeeName,
                deptId,
                deptName,
                req.getCreatedAt(),
                req.getUpdatedAt()
        );
    }
}
