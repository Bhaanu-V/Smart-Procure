package com.smartprocure.model.entity;

import com.smartprocure.model.enums.SlaStatus;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "sla_records")
public class SlaRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "purchase_request_id", nullable = false, unique = true)
    private PurchaseRequest purchaseRequest;

    @Column(name = "submission_time", nullable = false)
    private LocalDateTime submissionTime;

    @Column(name = "expected_approval_time", nullable = false)
    private LocalDateTime expectedApprovalTime;

    @Column(name = "actual_approval_time")
    private LocalDateTime actualApprovalTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "sla_status", nullable = false, length = 20)
    private SlaStatus slaStatus = SlaStatus.ON_TRACK;

    @Column(name = "hours_overdue")
    private Integer hoursOverdue = 0;

    public SlaRecord() {}

    public SlaRecord(Long id, PurchaseRequest purchaseRequest, LocalDateTime submissionTime, LocalDateTime expectedApprovalTime, LocalDateTime actualApprovalTime, SlaStatus slaStatus, Integer hoursOverdue) {
        this.id = id;
        this.purchaseRequest = purchaseRequest;
        this.submissionTime = submissionTime;
        this.expectedApprovalTime = expectedApprovalTime;
        this.actualApprovalTime = actualApprovalTime;
        this.slaStatus = slaStatus != null ? slaStatus : SlaStatus.ON_TRACK;
        this.hoursOverdue = hoursOverdue != null ? hoursOverdue : 0;
    }

    @PrePersist
    protected void onCreate() {
        if (this.submissionTime == null) {
            this.submissionTime = LocalDateTime.now();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public PurchaseRequest getPurchaseRequest() { return purchaseRequest; }
    public void setPurchaseRequest(PurchaseRequest purchaseRequest) { this.purchaseRequest = purchaseRequest; }

    public LocalDateTime getSubmissionTime() { return submissionTime; }
    public void setSubmissionTime(LocalDateTime submissionTime) { this.submissionTime = submissionTime; }

    public LocalDateTime getExpectedApprovalTime() { return expectedApprovalTime; }
    public void setExpectedApprovalTime(LocalDateTime expectedApprovalTime) { this.expectedApprovalTime = expectedApprovalTime; }

    public LocalDateTime getActualApprovalTime() { return actualApprovalTime; }
    public void setActualApprovalTime(LocalDateTime actualApprovalTime) { this.actualApprovalTime = actualApprovalTime; }

    public SlaStatus getSlaStatus() { return slaStatus; }
    public void setSlaStatus(SlaStatus slaStatus) { this.slaStatus = slaStatus; }

    public Integer getHoursOverdue() { return hoursOverdue; }
    public void setHoursOverdue(Integer hoursOverdue) { this.hoursOverdue = hoursOverdue; }
}
