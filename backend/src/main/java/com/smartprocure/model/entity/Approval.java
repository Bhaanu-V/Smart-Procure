package com.smartprocure.model.entity;

import com.smartprocure.model.enums.ApprovalAction;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "approvals")
public class Approval {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "purchase_request_id", nullable = false)
    private PurchaseRequest purchaseRequest;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_id", nullable = false)
    private User manager;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ApprovalAction action;

    @Column(columnDefinition = "TEXT")
    private String comments;

    @Column(name = "action_timestamp", nullable = false, updatable = false)
    private LocalDateTime actionTimestamp;

    public Approval() {}

    public Approval(Long id, PurchaseRequest purchaseRequest, User manager, ApprovalAction action, String comments, LocalDateTime actionTimestamp) {
        this.id = id;
        this.purchaseRequest = purchaseRequest;
        this.manager = manager;
        this.action = action;
        this.comments = comments;
        this.actionTimestamp = actionTimestamp;
    }

    @PrePersist
    protected void onCreate() {
        this.actionTimestamp = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public PurchaseRequest getPurchaseRequest() { return purchaseRequest; }
    public void setPurchaseRequest(PurchaseRequest purchaseRequest) { this.purchaseRequest = purchaseRequest; }

    public User getManager() { return manager; }
    public void setManager(User manager) { this.manager = manager; }

    public ApprovalAction getAction() { return action; }
    public void setAction(ApprovalAction action) { this.action = action; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }

    public LocalDateTime getActionTimestamp() { return actionTimestamp; }
    public void setActionTimestamp(LocalDateTime actionTimestamp) { this.actionTimestamp = actionTimestamp; }

    public static ApprovalBuilder builder() {
        return new ApprovalBuilder();
    }

    public static class ApprovalBuilder {
        private Long id;
        private PurchaseRequest purchaseRequest;
        private User manager;
        private ApprovalAction action;
        private String comments;
        private LocalDateTime actionTimestamp;

        public ApprovalBuilder id(Long id) { this.id = id; return this; }
        public ApprovalBuilder purchaseRequest(PurchaseRequest purchaseRequest) { this.purchaseRequest = purchaseRequest; return this; }
        public ApprovalBuilder manager(User manager) { this.manager = manager; return this; }
        public ApprovalBuilder action(ApprovalAction action) { this.action = action; return this; }
        public ApprovalBuilder comments(String comments) { this.comments = comments; return this; }
        public ApprovalBuilder actionTimestamp(LocalDateTime actionTimestamp) { this.actionTimestamp = actionTimestamp; return this; }

        public Approval build() {
            return new Approval(id, purchaseRequest, manager, action, comments, actionTimestamp);
        }
    }
}
