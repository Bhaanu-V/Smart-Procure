package com.smartprocure.dto;

import com.smartprocure.model.enums.ApprovalAction;

import java.time.LocalDateTime;

public class ApprovalResponseDTO {
    private Long id;
    private Long purchaseRequestId;
    private String requestNumber;
    private Long managerId;
    private String managerName;
    private ApprovalAction action;
    private String comments;
    private LocalDateTime actionTimestamp;

    public ApprovalResponseDTO() {}

    public ApprovalResponseDTO(Long id, Long purchaseRequestId, String requestNumber, Long managerId, String managerName,
                               ApprovalAction action, String comments, LocalDateTime actionTimestamp) {
        this.id = id;
        this.purchaseRequestId = purchaseRequestId;
        this.requestNumber = requestNumber;
        this.managerId = managerId;
        this.managerName = managerName;
        this.action = action;
        this.comments = comments;
        this.actionTimestamp = actionTimestamp;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPurchaseRequestId() { return purchaseRequestId; }
    public void setPurchaseRequestId(Long purchaseRequestId) { this.purchaseRequestId = purchaseRequestId; }

    public String getRequestNumber() { return requestNumber; }
    public void setRequestNumber(String requestNumber) { this.requestNumber = requestNumber; }

    public Long getManagerId() { return managerId; }
    public void setManagerId(Long managerId) { this.managerId = managerId; }

    public String getManagerName() { return managerName; }
    public void setManagerName(String managerName) { this.managerName = managerName; }

    public ApprovalAction getAction() { return action; }
    public void setAction(ApprovalAction action) { this.action = action; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }

    public LocalDateTime getActionTimestamp() { return actionTimestamp; }
    public void setActionTimestamp(LocalDateTime actionTimestamp) { this.actionTimestamp = actionTimestamp; }
}
