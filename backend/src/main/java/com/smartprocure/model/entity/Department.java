package com.smartprocure.model.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "departments")
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 20)
    private String code;

    @Column(name = "budget_allocated", precision = 15, scale = 2)
    private BigDecimal budgetAllocated = BigDecimal.ZERO;

    @Column(name = "budget_used", precision = 15, scale = 2)
    private BigDecimal budgetUsed = BigDecimal.ZERO;

    @Column(name = "budget_pending", precision = 15, scale = 2)
    private BigDecimal budgetPending = BigDecimal.ZERO;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Department() {}

    public Department(Long id, String name, String code, BigDecimal budgetAllocated, LocalDateTime createdAt) {
        this(id, name, code, budgetAllocated, BigDecimal.ZERO, BigDecimal.ZERO, createdAt, LocalDateTime.now());
    }

    public Department(Long id, String name, String code, BigDecimal budgetAllocated, BigDecimal budgetUsed, BigDecimal budgetPending, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.budgetAllocated = budgetAllocated != null ? budgetAllocated : BigDecimal.ZERO;
        this.budgetUsed = budgetUsed != null ? budgetUsed : BigDecimal.ZERO;
        this.budgetPending = budgetPending != null ? budgetPending : BigDecimal.ZERO;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }


    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public BigDecimal getBudgetAllocated() { return budgetAllocated; }
    public void setBudgetAllocated(BigDecimal budgetAllocated) { this.budgetAllocated = budgetAllocated; }

    public BigDecimal getBudgetUsed() { return budgetUsed; }
    public void setBudgetUsed(BigDecimal budgetUsed) { this.budgetUsed = budgetUsed; }

    public BigDecimal getBudgetPending() { return budgetPending; }
    public void setBudgetPending(BigDecimal budgetPending) { this.budgetPending = budgetPending; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static DepartmentBuilder builder() {
        return new DepartmentBuilder();
    }

    public static class DepartmentBuilder {
        private Long id;
        private String name;
        private String code;
        private BigDecimal budgetAllocated = BigDecimal.ZERO;
        private BigDecimal budgetUsed = BigDecimal.ZERO;
        private BigDecimal budgetPending = BigDecimal.ZERO;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public DepartmentBuilder id(Long id) { this.id = id; return this; }
        public DepartmentBuilder name(String name) { this.name = name; return this; }
        public DepartmentBuilder code(String code) { this.code = code; return this; }
        public DepartmentBuilder budgetAllocated(BigDecimal budgetAllocated) { this.budgetAllocated = budgetAllocated; return this; }
        public DepartmentBuilder budgetUsed(BigDecimal budgetUsed) { this.budgetUsed = budgetUsed; return this; }
        public DepartmentBuilder budgetPending(BigDecimal budgetPending) { this.budgetPending = budgetPending; return this; }
        public DepartmentBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public DepartmentBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Department build() {
            return new Department(id, name, code, budgetAllocated, budgetUsed, budgetPending, createdAt, updatedAt);
        }
    }
}

