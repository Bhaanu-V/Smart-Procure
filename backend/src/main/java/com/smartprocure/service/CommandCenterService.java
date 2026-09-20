package com.smartprocure.service;

import com.smartprocure.dto.CommandCenterMetricsDTO;
import com.smartprocure.model.entity.Department;
import com.smartprocure.model.entity.PurchaseRequest;
import com.smartprocure.model.enums.RequestStatus;
import com.smartprocure.model.enums.SlaStatus;
import com.smartprocure.repository.DepartmentRepository;
import com.smartprocure.repository.PurchaseRequestRepository;
import com.smartprocure.repository.SlaRecordRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CommandCenterService {

    private final PurchaseRequestRepository purchaseRequestRepository;
    private final DepartmentRepository departmentRepository;
    private final SlaRecordRepository slaRecordRepository;

    public CommandCenterService(PurchaseRequestRepository purchaseRequestRepository,
                                DepartmentRepository departmentRepository,
                                SlaRecordRepository slaRecordRepository) {
        this.purchaseRequestRepository = purchaseRequestRepository;
        this.departmentRepository = departmentRepository;
        this.slaRecordRepository = slaRecordRepository;
    }

    public CommandCenterMetricsDTO getCommandCenterMetrics() {
        List<PurchaseRequest> allRequests = purchaseRequestRepository.findAll();

        BigDecimal totalProcurementValue = allRequests.stream()
                .map(PurchaseRequest::getEstimatedCost)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long pendingApprovals = purchaseRequestRepository.countByStatus(RequestStatus.SUBMITTED)
                + purchaseRequestRepository.countByStatus(RequestStatus.IN_REVIEW);

        long requestsRequiringAction = pendingApprovals;

        long overdueApprovals = slaRecordRepository.countBySlaStatus(SlaStatus.OVERDUE);
        long slaOnTrackCount = slaRecordRepository.countBySlaStatus(SlaStatus.ON_TRACK);
        long slaDueSoonCount = slaRecordRepository.countBySlaStatus(SlaStatus.DUE_SOON);

        long totalApprovedCount = purchaseRequestRepository.countByStatus(RequestStatus.APPROVED);
        long totalRejectedCount = purchaseRequestRepository.countByStatus(RequestStatus.REJECTED);

        // Department Spending map
        List<Department> departments = departmentRepository.findAll();
        Map<String, BigDecimal> deptSpending = new HashMap<>();
        for (Department d : departments) {
            deptSpending.put(d.getName(), d.getBudgetUsed() != null ? d.getBudgetUsed() : BigDecimal.ZERO);
        }

        // Monthly Spending map
        Map<String, BigDecimal> monthlySpending = new HashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM yyyy");
        for (PurchaseRequest pr : allRequests) {
            if (pr.getStatus() == RequestStatus.APPROVED) {
                String monthKey = pr.getCreatedAt().format(formatter);
                monthlySpending.put(monthKey, monthlySpending.getOrDefault(monthKey, BigDecimal.ZERO).add(pr.getEstimatedCost()));
            }
        }

        return new CommandCenterMetricsDTO(
                totalProcurementValue,
                pendingApprovals,
                requestsRequiringAction,
                overdueApprovals,
                slaOnTrackCount,
                slaDueSoonCount,
                totalApprovedCount,
                totalRejectedCount,
                deptSpending,
                monthlySpending
        );
    }
}
