package com.smartprocure.controller;

import com.smartprocure.dto.CreatePurchaseRequestDTO;
import com.smartprocure.dto.PurchaseRequestResponseDTO;
import com.smartprocure.service.PurchaseRequestService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/purchase-requests")
public class PurchaseRequestController {

    private final PurchaseRequestService purchaseRequestService;

    public PurchaseRequestController(PurchaseRequestService purchaseRequestService) {
        this.purchaseRequestService = purchaseRequestService;
    }

    @PostMapping
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<PurchaseRequestResponseDTO> createRequest(
            @Valid @RequestBody CreatePurchaseRequestDTO dto,
            @AuthenticationPrincipal UserDetails userDetails) {
        PurchaseRequestResponseDTO response = purchaseRequestService.createPurchaseRequest(dto, userDetails.getUsername());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<List<PurchaseRequestResponseDTO>> getMyRequests(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<PurchaseRequestResponseDTO> requests = purchaseRequestService.getEmployeeRequests(userDetails.getUsername());
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'MANAGER', 'ADMIN')")
    public ResponseEntity<PurchaseRequestResponseDTO> getRequestById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        PurchaseRequestResponseDTO response = purchaseRequestService.getRequestById(id, userDetails.getUsername());
        return ResponseEntity.ok(response);
    }
}
