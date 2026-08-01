package com.smartprocure.service;

import com.smartprocure.dto.ApprovalDecisionDTO;
import com.smartprocure.dto.ApprovalResponseDTO;
import com.smartprocure.dto.PurchaseRequestResponseDTO;

import java.util.List;

public interface ApprovalService {
    List<PurchaseRequestResponseDTO> getPendingDepartmentRequests(String managerEmail);
    ApprovalResponseDTO processApprovalDecision(Long requestId, ApprovalDecisionDTO decisionDTO, String managerEmail);
    List<ApprovalResponseDTO> getRequestApprovalHistory(Long requestId, String userEmail);
}
