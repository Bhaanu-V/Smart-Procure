package com.smartprocure.controller;

import com.smartprocure.dto.ApprovalDecisionDTO;
import com.smartprocure.dto.ApprovalResponseDTO;
import com.smartprocure.dto.PurchaseRequestResponseDTO;
import com.smartprocure.service.ApprovalService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/approvals")
public class ApprovalController {

    private final ApprovalService approvalService;

    public ApprovalController(ApprovalService approvalService) {
        this.approvalService = approvalService;
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<List<PurchaseRequestResponseDTO>> getPendingRequests(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<PurchaseRequestResponseDTO> pending = approvalService.getPendingDepartmentRequests(userDetails.getUsername());
        return ResponseEntity.ok(pending);
    }

    @PostMapping("/{requestId}/review")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ApprovalResponseDTO> reviewRequest(
            @PathVariable Long requestId,
            @Valid @RequestBody ApprovalDecisionDTO decisionDTO,
            @AuthenticationPrincipal UserDetails userDetails) {
        ApprovalResponseDTO response = approvalService.processApprovalDecision(requestId, decisionDTO, userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/history/{requestId}")
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'MANAGER', 'ADMIN')")
    public ResponseEntity<List<ApprovalResponseDTO>> getApprovalHistory(
            @PathVariable Long requestId,
            @AuthenticationPrincipal UserDetails userDetails) {
        List<ApprovalResponseDTO> history = approvalService.getRequestApprovalHistory(requestId, userDetails.getUsername());
        return ResponseEntity.ok(history);
    }
}
