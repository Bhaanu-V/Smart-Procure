package com.smartprocure.model.entity;

import com.smartprocure.model.enums.RequestStatus;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "purchase_requests")
public class PurchaseRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "request_number", nullable = false, unique = true, length = 50)
    private String requestNumber;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 100)
    private String category;

    @Column(name = "estimated_cost", nullable = false, precision = 15, scale = 2)
    private BigDecimal estimatedCost;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private RequestStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private User employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public PurchaseRequest() {}

    public PurchaseRequest(Long id, String requestNumber, String title, String description, String category, BigDecimal estimatedCost, RequestStatus status, User employee, Department department, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.requestNumber = requestNumber;
        this.title = title;
        this.description = description;
        this.category = category;
        this.estimatedCost = estimatedCost;
        this.status = status;
        this.employee = employee;
        this.department = department;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = RequestStatus.SUBMITTED;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRequestNumber() { return requestNumber; }
    public void setRequestNumber(String requestNumber) { this.requestNumber = requestNumber; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public BigDecimal getEstimatedCost() { return estimatedCost; }
    public void setEstimatedCost(BigDecimal estimatedCost) { this.estimatedCost = estimatedCost; }

    public RequestStatus getStatus() { return status; }
    public void setStatus(RequestStatus status) { this.status = status; }

    public User getEmployee() { return employee; }
    public void setEmployee(User employee) { this.employee = employee; }

    public Department getDepartment() { return department; }
    public void setDepartment(Department department) { this.department = department; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static PurchaseRequestBuilder builder() {
        return new PurchaseRequestBuilder();
    }

    public static class PurchaseRequestBuilder {
        private Long id;
        private String requestNumber;
        private String title;
        private String description;
        private String category;
        private BigDecimal estimatedCost;
        private RequestStatus status;
        private User employee;
        private Department department;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public PurchaseRequestBuilder id(Long id) { this.id = id; return this; }
        public PurchaseRequestBuilder requestNumber(String requestNumber) { this.requestNumber = requestNumber; return this; }
        public PurchaseRequestBuilder title(String title) { this.title = title; return this; }
        public PurchaseRequestBuilder description(String description) { this.description = description; return this; }
        public PurchaseRequestBuilder category(String category) { this.category = category; return this; }
        public PurchaseRequestBuilder estimatedCost(BigDecimal estimatedCost) { this.estimatedCost = estimatedCost; return this; }
        public PurchaseRequestBuilder status(RequestStatus status) { this.status = status; return this; }
        public PurchaseRequestBuilder employee(User employee) { this.employee = employee; return this; }
        public PurchaseRequestBuilder department(Department department) { this.department = department; return this; }
        public PurchaseRequestBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public PurchaseRequestBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public PurchaseRequest build() {
            return new PurchaseRequest(id, requestNumber, title, description, category, estimatedCost, status, employee, department, createdAt, updatedAt);
        }
    }
}
