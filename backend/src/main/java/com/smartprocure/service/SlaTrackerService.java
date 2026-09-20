package com.smartprocure.service;

import com.smartprocure.model.entity.PurchaseRequest;
import com.smartprocure.model.entity.SlaRecord;
import com.smartprocure.model.enums.PriorityLevel;
import com.smartprocure.model.enums.SlaStatus;
import com.smartprocure.model.enums.UrgencyLevel;
import com.smartprocure.repository.SlaRecordRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class SlaTrackerService {

    private final SlaRecordRepository slaRecordRepository;

    public SlaTrackerService(SlaRecordRepository slaRecordRepository) {
        this.slaRecordRepository = slaRecordRepository;
    }

    @Transactional
    public SlaRecord initializeSla(PurchaseRequest pr) {
        int slaHours = 48; // Default 48 hours for standard orders
        if (pr.getUrgency() == UrgencyLevel.CRITICAL || pr.getPriorityLevel() == PriorityLevel.URGENT) {
            slaHours = 12; // 12 hours for critical
        } else if (pr.getUrgency() == UrgencyLevel.HIGH || pr.getPriorityLevel() == PriorityLevel.HIGH) {
            slaHours = 24; // 24 hours for high
        }

        LocalDateTime submission = LocalDateTime.now();
        LocalDateTime expected = submission.plusHours(slaHours);

        SlaRecord record = new SlaRecord();
        record.setPurchaseRequest(pr);
        record.setSubmissionTime(submission);
        record.setExpectedApprovalTime(expected);
        record.setSlaStatus(SlaStatus.ON_TRACK);
        record.setHoursOverdue(0);

        return slaRecordRepository.save(record);
    }

    @Transactional
    public void markCompleted(Long purchaseRequestId) {
        slaRecordRepository.findByPurchaseRequestId(purchaseRequestId).ifPresent(record -> {
            record.setActualApprovalTime(LocalDateTime.now());
            record.setSlaStatus(SlaStatus.COMPLETED);
            slaRecordRepository.save(record);
        });
    }

    @Scheduled(fixedRate = 600000) // Every 10 minutes
    @Transactional
    public void updateSlaStatuses() {
        List<SlaRecord> activeRecords = slaRecordRepository.findAll().stream()
                .filter(r -> r.getSlaStatus() != SlaStatus.COMPLETED)
                .toList();

        LocalDateTime now = LocalDateTime.now();

        for (SlaRecord record : activeRecords) {
            if (now.isAfter(record.getExpectedApprovalTime())) {
                record.setSlaStatus(SlaStatus.OVERDUE);
                long overdueHours = Duration.between(record.getExpectedApprovalTime(), now).toHours();
                record.setHoursOverdue((int) overdueHours);
            } else {
                long remainingHours = Duration.between(now, record.getExpectedApprovalTime()).toHours();
                if (remainingHours <= 12) {
                    record.setSlaStatus(SlaStatus.DUE_SOON);
                } else {
                    record.setSlaStatus(SlaStatus.ON_TRACK);
                }
            }
            slaRecordRepository.save(record);
        }
    }
}
