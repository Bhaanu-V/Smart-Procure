package com.smartprocure.dto;

import com.smartprocure.model.enums.RequestStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PurchaseRequestResponseDTO {
    private Long id;
    private String requestNumber;
    private String title;
    private String description;
    private String category;
    private BigDecimal estimatedCost;
    private RequestStatus status;
    private Long employeeId;
    private String employeeName;
    private Long departmentId;
    private String departmentName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public PurchaseRequestResponseDTO() {}

    public PurchaseRequestResponseDTO(Long id, String requestNumber, String title, String description, String category,
                                     BigDecimal estimatedCost, RequestStatus status, Long employeeId, String employeeName,
                                     Long departmentId, String departmentName, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.requestNumber = requestNumber;
        this.title = title;
        this.description = description;
        this.category = category;
        this.estimatedCost = estimatedCost;
        this.status = status;
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
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

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }

    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }

    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
