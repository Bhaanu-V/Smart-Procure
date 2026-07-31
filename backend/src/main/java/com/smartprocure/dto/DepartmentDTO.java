package com.smartprocure.dto;

import java.math.BigDecimal;

public class DepartmentDTO {
    private Long id;
    private String name;
    private String code;
    private BigDecimal budgetAllocated;

    public DepartmentDTO() {}

    public DepartmentDTO(Long id, String name, String code, BigDecimal budgetAllocated) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.budgetAllocated = budgetAllocated;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public BigDecimal getBudgetAllocated() { return budgetAllocated; }
    public void setBudgetAllocated(BigDecimal budgetAllocated) { this.budgetAllocated = budgetAllocated; }
}
