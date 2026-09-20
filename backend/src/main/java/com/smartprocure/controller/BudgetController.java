package com.smartprocure.controller;

import com.smartprocure.dto.BudgetImpactDTO;
import com.smartprocure.service.BudgetGovernanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/v1/departments")
public class BudgetController {

    private final BudgetGovernanceService budgetGovernanceService;

    public BudgetController(BudgetGovernanceService budgetGovernanceService) {
        this.budgetGovernanceService = budgetGovernanceService;
    }

    @GetMapping("/{id}/budget-impact")
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'MANAGER', 'ADMIN')")
    public ResponseEntity<BudgetImpactDTO> getBudgetImpact(@PathVariable Long id, @RequestParam(defaultValue = "0") BigDecimal cost) {
        return ResponseEntity.ok(budgetGovernanceService.calculateBudgetImpact(id, cost));
    }
}
