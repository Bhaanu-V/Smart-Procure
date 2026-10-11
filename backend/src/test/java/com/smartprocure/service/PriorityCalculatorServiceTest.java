package com.smartprocure.service;

import com.smartprocure.model.enums.PriorityLevel;
import com.smartprocure.model.enums.UrgencyLevel;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

public class PriorityCalculatorServiceTest {

    private PriorityCalculatorService priorityCalculatorService;

    @BeforeEach
    public void setUp() {
        priorityCalculatorService = new PriorityCalculatorService();
    }

    @Test
    @DisplayName("Should return URGENT priority for high cost, critical urgency, and older requests")
    public void testHighCostAndCriticalUrgencyReturnsUrgent() {
        BigDecimal cost = new BigDecimal("60000");
        UrgencyLevel urgency = UrgencyLevel.CRITICAL;
        LocalDateTime createdAt = LocalDateTime.now().minusDays(8);

        PriorityCalculatorService.PriorityResult result =
                priorityCalculatorService.calculatePriority(cost, urgency, createdAt);

        // Cost score: 40, Urgency score: 35, Age score: 25 -> Total: 100
        assertThat(result.getScore()).isEqualTo(100);
        assertThat(result.getLevel()).isEqualTo(PriorityLevel.URGENT);
    }

    @Test
    @DisplayName("Should return LOW priority for low cost, low urgency, and recent requests")
    public void testLowCostAndLowUrgencyReturnsLow() {
        BigDecimal cost = new BigDecimal("1000");
        UrgencyLevel urgency = UrgencyLevel.LOW;
        LocalDateTime createdAt = LocalDateTime.now();

        PriorityCalculatorService.PriorityResult result =
                priorityCalculatorService.calculatePriority(cost, urgency, createdAt);

        // Cost score: 10, Urgency score: 5, Age score: 5 -> Total: 20
        assertThat(result.getScore()).isEqualTo(20);
        assertThat(result.getLevel()).isEqualTo(PriorityLevel.LOW);
    }

    @Test
    @DisplayName("Should return NORMAL priority for medium tier thresholds")
    public void testMediumTierReturnsNormal() {
        BigDecimal cost = new BigDecimal("5000");
        UrgencyLevel urgency = UrgencyLevel.MEDIUM;
        LocalDateTime createdAt = LocalDateTime.now();

        PriorityCalculatorService.PriorityResult result =
                priorityCalculatorService.calculatePriority(cost, urgency, createdAt);

        // Cost score: 20, Urgency score: 15, Age score: 5 -> Total: 40
        assertThat(result.getScore()).isEqualTo(40);
        assertThat(result.getLevel()).isEqualTo(PriorityLevel.NORMAL);
    }
}
