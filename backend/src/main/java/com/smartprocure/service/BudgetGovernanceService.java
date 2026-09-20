package com.smartprocure.service;

import com.smartprocure.dto.BudgetImpactDTO;
import com.smartprocure.exception.ResourceNotFoundException;
import com.smartprocure.model.entity.Department;
import com.smartprocure.repository.DepartmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class BudgetGovernanceService {

    private final DepartmentRepository departmentRepository;

    public BudgetGovernanceService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    public BudgetImpactDTO calculateBudgetImpact(Long departmentId, BigDecimal requestCost) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", departmentId));

        BigDecimal allocated = department.getBudgetAllocated() != null ? department.getBudgetAllocated() : BigDecimal.ZERO;
        BigDecimal used = department.getBudgetUsed() != null ? department.getBudgetUsed() : BigDecimal.ZERO;
        BigDecimal pending = department.getBudgetPending() != null ? department.getBudgetPending() : BigDecimal.ZERO;

        BigDecimal remaining = allocated.subtract(used).subtract(pending);
        BigDecimal cost = requestCost != null ? requestCost : BigDecimal.ZERO;
        BigDecimal projectedRemaining = remaining.subtract(cost);

        boolean isExceeded = projectedRemaining.compareTo(BigDecimal.ZERO) < 0;

        double usagePercentage = 0.0;
        if (allocated.compareTo(BigDecimal.ZERO) > 0) {
            usagePercentage = used.add(pending).add(cost)
                    .multiply(new BigDecimal("100"))
                    .divide(allocated, 2, RoundingMode.HALF_UP)
                    .doubleValue();
        }

        return new BudgetImpactDTO(
                department.getId(),
                department.getName(),
                allocated,
                used,
                pending,
                remaining,
                cost,
                projectedRemaining,
                isExceeded,
                usagePercentage
        );
    }

    @Transactional
    public void recordPendingRequest(Department department, BigDecimal amount) {
        if (amount == null) return;
        BigDecimal currentPending = department.getBudgetPending() != null ? department.getBudgetPending() : BigDecimal.ZERO;
        department.setBudgetPending(currentPending.add(amount));
        departmentRepository.save(department);
    }

    @Transactional
    public void recordApproval(Department department, BigDecimal amount) {
        if (amount == null) return;
        BigDecimal currentPending = department.getBudgetPending() != null ? department.getBudgetPending() : BigDecimal.ZERO;
        BigDecimal currentUsed = department.getBudgetUsed() != null ? department.getBudgetUsed() : BigDecimal.ZERO;

        BigDecimal newPending = currentPending.subtract(amount);
        if (newPending.compareTo(BigDecimal.ZERO) < 0) {
            newPending = BigDecimal.ZERO;
        }

        department.setBudgetPending(newPending);
        department.setBudgetUsed(currentUsed.add(amount));
        departmentRepository.save(department);
    }

    @Transactional
    public void releasePending(Department department, BigDecimal amount) {
        if (amount == null) return;
        BigDecimal currentPending = department.getBudgetPending() != null ? department.getBudgetPending() : BigDecimal.ZERO;
        BigDecimal newPending = currentPending.subtract(amount);
        if (newPending.compareTo(BigDecimal.ZERO) < 0) {
            newPending = BigDecimal.ZERO;
        }
        department.setBudgetPending(newPending);
        departmentRepository.save(department);
    }
}
