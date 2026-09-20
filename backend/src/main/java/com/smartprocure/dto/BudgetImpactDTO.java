package com.smartprocure.dto;

import java.math.BigDecimal;

public class BudgetImpactDTO {
    private Long departmentId;
    private String departmentName;
    private BigDecimal allocatedBudget;
    private BigDecimal usedBudget;
    private BigDecimal pendingBudget;
    private BigDecimal remainingBudget;
    private BigDecimal requestCost;
    private BigDecimal projectedRemainingBudget;
    private boolean isExceeded;
    private double usagePercentage;

    public BudgetImpactDTO() {}

    public BudgetImpactDTO(Long departmentId, String departmentName, BigDecimal allocatedBudget, BigDecimal usedBudget,
                           BigDecimal pendingBudget, BigDecimal remainingBudget, BigDecimal requestCost,
                           BigDecimal projectedRemainingBudget, boolean isExceeded, double usagePercentage) {
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.allocatedBudget = allocatedBudget;
        this.usedBudget = usedBudget;
        this.pendingBudget = pendingBudget;
        this.remainingBudget = remainingBudget;
        this.requestCost = requestCost;
        this.projectedRemainingBudget = projectedRemainingBudget;
        this.isExceeded = isExceeded;
        this.usagePercentage = usagePercentage;
    }

    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }

    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }

    public BigDecimal getAllocatedBudget() { return allocatedBudget; }
    public void setAllocatedBudget(BigDecimal allocatedBudget) { this.allocatedBudget = allocatedBudget; }

    public BigDecimal getUsedBudget() { return usedBudget; }
    public void setUsedBudget(BigDecimal usedBudget) { this.usedBudget = usedBudget; }

    public BigDecimal getPendingBudget() { return pendingBudget; }
    public void setPendingBudget(BigDecimal pendingBudget) { this.pendingBudget = pendingBudget; }

    public BigDecimal getRemainingBudget() { return remainingBudget; }
    public void setRemainingBudget(BigDecimal remainingBudget) { this.remainingBudget = remainingBudget; }

    public BigDecimal getRequestCost() { return requestCost; }
    public void setRequestCost(BigDecimal requestCost) { this.requestCost = requestCost; }

    public BigDecimal getProjectedRemainingBudget() { return projectedRemainingBudget; }
    public void setProjectedRemainingBudget(BigDecimal projectedRemainingBudget) { this.projectedRemainingBudget = projectedRemainingBudget; }

    public boolean isExceeded() { return isExceeded; }
    public void setExceeded(boolean exceeded) { isExceeded = exceeded; }

    public double getUsagePercentage() { return usagePercentage; }
    public void setUsagePercentage(double usagePercentage) { this.usagePercentage = usagePercentage; }
}
