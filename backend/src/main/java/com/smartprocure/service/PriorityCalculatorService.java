package com.smartprocure.service;

import com.smartprocure.model.enums.PriorityLevel;
import com.smartprocure.model.enums.UrgencyLevel;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;

@Service
public class PriorityCalculatorService {

    public static class PriorityResult {
        private final int score;
        private final PriorityLevel level;

        public PriorityResult(int score, PriorityLevel level) {
            this.score = score;
            this.level = level;
        }

        public int getScore() { return score; }
        public PriorityLevel getLevel() { return level; }
    }

    public PriorityResult calculatePriority(BigDecimal cost, UrgencyLevel urgency, LocalDateTime createdAt) {
        int costScore = 10;
        if (cost != null) {
            if (cost.compareTo(new BigDecimal("50000")) >= 0) {
                costScore = 40;
            } else if (cost.compareTo(new BigDecimal("10000")) >= 0) {
                costScore = 30;
            } else if (cost.compareTo(new BigDecimal("2500")) >= 0) {
                costScore = 20;
            }
        }

        int urgencyScore = 15;
        if (urgency != null) {
            switch (urgency) {
                case CRITICAL -> urgencyScore = 35;
                case HIGH -> urgencyScore = 25;
                case MEDIUM -> urgencyScore = 15;
                case LOW -> urgencyScore = 5;
            }
        }

        int ageScore = 5;
        if (createdAt != null) {
            long days = Duration.between(createdAt, LocalDateTime.now()).toDays();
            if (days >= 7) {
                ageScore = 25;
            } else if (days >= 3) {
                ageScore = 15;
            }
        }

        int totalScore = costScore + urgencyScore + ageScore;
        PriorityLevel level;

        if (totalScore >= 75) {
            level = PriorityLevel.URGENT;
        } else if (totalScore >= 50) {
            level = PriorityLevel.HIGH;
        } else if (totalScore >= 30) {
            level = PriorityLevel.NORMAL;
        } else {
            level = PriorityLevel.LOW;
        }

        return new PriorityResult(totalScore, level);
    }
}
