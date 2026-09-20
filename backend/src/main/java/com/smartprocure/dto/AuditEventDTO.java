package com.smartprocure.dto;

import java.time.LocalDateTime;

public class AuditEventDTO {
    private Long id;
    private Long purchaseRequestId;
    private String actorName;
    private String actorRole;
    private String action;
    private String previousStatus;
    private String newStatus;
    private String comment;
    private LocalDateTime createdAt;

    public AuditEventDTO() {}

    public AuditEventDTO(Long id, Long purchaseRequestId, String actorName, String actorRole, String action, String previousStatus, String newStatus, String comment, LocalDateTime createdAt) {
        this.id = id;
        this.purchaseRequestId = purchaseRequestId;
        this.actorName = actorName;
        this.actorRole = actorRole;
        this.action = action;
        this.previousStatus = previousStatus;
        this.newStatus = newStatus;
        this.comment = comment;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPurchaseRequestId() { return purchaseRequestId; }
    public void setPurchaseRequestId(Long purchaseRequestId) { this.purchaseRequestId = purchaseRequestId; }

    public String getActorName() { return actorName; }
    public void setActorName(String actorName) { this.actorName = actorName; }

    public String getActorRole() { return actorRole; }
    public void setActorRole(String actorRole) { this.actorRole = actorRole; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getPreviousStatus() { return previousStatus; }
    public void setPreviousStatus(String previousStatus) { this.previousStatus = previousStatus; }

    public String getNewStatus() { return newStatus; }
    public void setNewStatus(String newStatus) { this.newStatus = newStatus; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
