package com.smartprocure.service;

import com.smartprocure.dto.CreatePurchaseRequestDTO;
import com.smartprocure.dto.PurchaseRequestResponseDTO;

import java.util.List;

public interface PurchaseRequestService {
    PurchaseRequestResponseDTO createPurchaseRequest(CreatePurchaseRequestDTO dto, String employeeEmail);
    List<PurchaseRequestResponseDTO> getEmployeeRequests(String employeeEmail);
    PurchaseRequestResponseDTO getRequestById(Long id, String userEmail);
}
