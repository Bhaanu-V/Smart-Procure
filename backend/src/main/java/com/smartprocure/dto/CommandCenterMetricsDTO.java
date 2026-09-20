package com.smartprocure.dto;

import java.math.BigDecimal;
import java.util.Map;

public class CommandCenterMetricsDTO {
    private BigDecimal totalProcurementValue;
    private long pendingApprovals;
    private long requestsRequiringAction;
    private long overdueApprovals;
    private long slaOnTrackCount;
    private long slaDueSoonCount;
    private long totalApprovedCount;
    private long totalRejectedCount;
    private Map<String, BigDecimal> departmentSpending;
    private Map<String, BigDecimal> monthlySpending;

    public CommandCenterMetricsDTO() {}

    public CommandCenterMetricsDTO(BigDecimal totalProcurementValue, long pendingApprovals, long requestsRequiringAction,
                                  long overdueApprovals, long slaOnTrackCount, long slaDueSoonCount,
                                  long totalApprovedCount, long totalRejectedCount,
                                  Map<String, BigDecimal> departmentSpending, Map<String, BigDecimal> monthlySpending) {
        this.totalProcurementValue = totalProcurementValue;
        this.pendingApprovals = pendingApprovals;
        this.requestsRequiringAction = requestsRequiringAction;
        this.overdueApprovals = overdueApprovals;
        this.slaOnTrackCount = slaOnTrackCount;
        this.slaDueSoonCount = slaDueSoonCount;
        this.totalApprovedCount = totalApprovedCount;
        this.totalRejectedCount = totalRejectedCount;
        this.departmentSpending = departmentSpending;
        this.monthlySpending = monthlySpending;
    }

    public BigDecimal getTotalProcurementValue() { return totalProcurementValue; }
    public void setTotalProcurementValue(BigDecimal totalProcurementValue) { this.totalProcurementValue = totalProcurementValue; }

    public long getPendingApprovals() { return pendingApprovals; }
    public void setPendingApprovals(long pendingApprovals) { this.pendingApprovals = pendingApprovals; }

    public long getRequestsRequiringAction() { return requestsRequiringAction; }
    public void setRequestsRequiringAction(long requestsRequiringAction) { this.requestsRequiringAction = requestsRequiringAction; }

    public long getOverdueApprovals() { return overdueApprovals; }
    public void setOverdueApprovals(long overdueApprovals) { this.overdueApprovals = overdueApprovals; }

    public long getSlaOnTrackCount() { return slaOnTrackCount; }
    public void setSlaOnTrackCount(long slaOnTrackCount) { this.slaOnTrackCount = slaOnTrackCount; }

    public long getSlaDueSoonCount() { return slaDueSoonCount; }
    public void setSlaDueSoonCount(long slaDueSoonCount) { this.slaDueSoonCount = slaDueSoonCount; }

    public long getTotalApprovedCount() { return totalApprovedCount; }
    public void setTotalApprovedCount(long totalApprovedCount) { this.totalApprovedCount = totalApprovedCount; }

    public long getTotalRejectedCount() { return totalRejectedCount; }
    public void setTotalRejectedCount(long totalRejectedCount) { this.totalRejectedCount = totalRejectedCount; }

    public Map<String, BigDecimal> getDepartmentSpending() { return departmentSpending; }
    public void setDepartmentSpending(Map<String, BigDecimal> departmentSpending) { this.departmentSpending = departmentSpending; }

    public Map<String, BigDecimal> getMonthlySpending() { return monthlySpending; }
    public void setMonthlySpending(Map<String, BigDecimal> monthlySpending) { this.monthlySpending = monthlySpending; }
}
