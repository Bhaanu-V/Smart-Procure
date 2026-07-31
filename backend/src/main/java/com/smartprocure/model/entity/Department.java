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
    private BigDecimal budgetAllocated;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Department() {}

    public Department(Long id, String name, String code, BigDecimal budgetAllocated, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.budgetAllocated = budgetAllocated;
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public BigDecimal getBudgetAllocated() { return budgetAllocated; }
    public void setBudgetAllocated(BigDecimal budgetAllocated) { this.budgetAllocated = budgetAllocated; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static DepartmentBuilder builder() {
        return new DepartmentBuilder();
    }

    public static class DepartmentBuilder {
        private Long id;
        private String name;
        private String code;
        private BigDecimal budgetAllocated;
        private LocalDateTime createdAt;

        public DepartmentBuilder id(Long id) { this.id = id; return this; }
        public DepartmentBuilder name(String name) { this.name = name; return this; }
        public DepartmentBuilder code(String code) { this.code = code; return this; }
        public DepartmentBuilder budgetAllocated(BigDecimal budgetAllocated) { this.budgetAllocated = budgetAllocated; return this; }
        public DepartmentBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Department build() {
            return new Department(id, name, code, budgetAllocated, createdAt);
        }
    }
}
