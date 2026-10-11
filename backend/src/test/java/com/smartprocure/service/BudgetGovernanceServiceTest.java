package com.smartprocure.service;

import com.smartprocure.dto.BudgetImpactDTO;
import com.smartprocure.model.entity.Department;
import com.smartprocure.repository.DepartmentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class BudgetGovernanceServiceTest {

    @Mock
    private DepartmentRepository departmentRepository;

    @InjectMocks
    private BudgetGovernanceService budgetGovernanceService;

    private Department department;

    @BeforeEach
    public void setUp() {
        department = Department.builder()
                .id(1L)
                .name("Engineering")
                .code("ENG")
                .budgetAllocated(new BigDecimal("100000.00"))
                .budgetUsed(new BigDecimal("30000.00"))
                .budgetPending(new BigDecimal("10000.00"))
                .build();
    }

    @Test
    @DisplayName("Should correctly calculate remaining budget and usage percentage")
    public void testCalculateBudgetImpactWithinLimit() {
        when(departmentRepository.findById(1L)).thenReturn(Optional.of(department));

        BudgetImpactDTO impact = budgetGovernanceService.calculateBudgetImpact(1L, new BigDecimal("20000.00"));

        assertThat(impact.getDepartmentName()).isEqualTo("Engineering");
        assertThat(impact.getRemainingBudget()).isEqualByComparingTo("60000.00");
        assertThat(impact.getProjectedRemainingBudget()).isEqualByComparingTo("40000.00");
        assertThat(impact.isExceeded()).isFalse();
        assertThat(impact.getUsagePercentage()).isEqualTo(60.0);
    }

    @Test
    @DisplayName("Should detect when purchase request exceeds remaining budget")
    public void testCalculateBudgetImpactExceeded() {
        when(departmentRepository.findById(1L)).thenReturn(Optional.of(department));

        BudgetImpactDTO impact = budgetGovernanceService.calculateBudgetImpact(1L, new BigDecimal("70000.00"));

        assertThat(impact.isExceeded()).isTrue();
        assertThat(impact.getProjectedRemainingBudget()).isEqualByComparingTo("-10000.00");
    }

    @Test
    @DisplayName("Should properly update pending budget on new request")
    public void testRecordPendingRequest() {
        budgetGovernanceService.recordPendingRequest(department, new BigDecimal("5000.00"));

        assertThat(department.getBudgetPending()).isEqualByComparingTo("15000.00");
        verify(departmentRepository, times(1)).save(department);
    }
}
