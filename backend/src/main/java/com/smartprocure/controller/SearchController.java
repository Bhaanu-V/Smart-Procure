package com.smartprocure.controller;

import com.smartprocure.dto.PurchaseRequestResponseDTO;
import com.smartprocure.model.entity.PurchaseRequest;
import com.smartprocure.model.entity.SlaRecord;
import com.smartprocure.model.enums.SlaStatus;
import com.smartprocure.repository.PurchaseRequestRepository;
import com.smartprocure.repository.SlaRecordRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.transaction.annotation.Transactional;

@RestController
@RequestMapping("/api/v1/search")
@Transactional(readOnly = true)
public class SearchController {

    private final PurchaseRequestRepository purchaseRequestRepository;
    private final SlaRecordRepository slaRecordRepository;

    public SearchController(PurchaseRequestRepository purchaseRequestRepository, SlaRecordRepository slaRecordRepository) {
        this.purchaseRequestRepository = purchaseRequestRepository;
        this.slaRecordRepository = slaRecordRepository;
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<PurchaseRequestResponseDTO>> globalSearch(@RequestParam("q") String query) {
        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.ok(List.of());
        }

        List<PurchaseRequest> results = purchaseRequestRepository.globalSearch(query.trim());

        List<PurchaseRequestResponseDTO> response = results.stream().map(req -> {
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
                    req.getEmployee() != null ? req.getEmployee().getId() : null,
                    req.getEmployee() != null ? req.getEmployee().getFullName() : "N/A",
                    req.getDepartment() != null ? req.getDepartment().getId() : null,
                    req.getDepartment() != null ? req.getDepartment().getName() : "N/A",
                    req.getCreatedAt(),
                    req.getUpdatedAt(),
                    slaStatus,
                    expectedTime
            );
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
}
