package com.smartprocure.service;

import com.smartprocure.model.entity.PurchaseRequest;
import com.smartprocure.model.entity.SlaRecord;
import com.smartprocure.model.enums.PriorityLevel;
import com.smartprocure.model.enums.SlaStatus;
import com.smartprocure.model.enums.UrgencyLevel;
import com.smartprocure.repository.SlaRecordRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SlaTrackerServiceTest {

    @Mock
    private SlaRecordRepository slaRecordRepository;

    @InjectMocks
    private SlaTrackerService slaTrackerService;

    @BeforeEach
    public void setUp() {
    }

    @Test
    @DisplayName("Should initialize SLA with 12 hour target for critical requests")
    public void testInitializeSlaCritical() {
        PurchaseRequest pr = PurchaseRequest.builder()
                .id(10L)
                .urgency(UrgencyLevel.CRITICAL)
                .priorityLevel(PriorityLevel.URGENT)
                .build();

        when(slaRecordRepository.save(any(SlaRecord.class))).thenAnswer(invocation -> invocation.getArgument(0));

        SlaRecord record = slaTrackerService.initializeSla(pr);

        assertThat(record.getSlaStatus()).isEqualTo(SlaStatus.ON_TRACK);
        long hours = Duration.between(record.getSubmissionTime(), record.getExpectedApprovalTime()).toHours();
        assertThat(hours).isEqualTo(12);
    }

    @Test
    @DisplayName("Should initialize SLA with 48 hour target for standard requests")
    public void testInitializeSlaStandard() {
        PurchaseRequest pr = PurchaseRequest.builder()
                .id(11L)
                .urgency(UrgencyLevel.LOW)
                .priorityLevel(PriorityLevel.LOW)
                .build();

        when(slaRecordRepository.save(any(SlaRecord.class))).thenAnswer(invocation -> invocation.getArgument(0));

        SlaRecord record = slaTrackerService.initializeSla(pr);

        assertThat(record.getSlaStatus()).isEqualTo(SlaStatus.ON_TRACK);
        long hours = Duration.between(record.getSubmissionTime(), record.getExpectedApprovalTime()).toHours();
        assertThat(hours).isEqualTo(48);
    }

    @Test
    @DisplayName("Should mark SLA as completed upon approval")
    public void testMarkCompleted() {
        SlaRecord record = new SlaRecord();
        record.setId(1L);
        record.setSlaStatus(SlaStatus.ON_TRACK);

        when(slaRecordRepository.findByPurchaseRequestId(10L)).thenReturn(Optional.of(record));

        slaTrackerService.markCompleted(10L);

        assertThat(record.getSlaStatus()).isEqualTo(SlaStatus.COMPLETED);
        assertThat(record.getActualApprovalTime()).isNotNull();
        verify(slaRecordRepository, times(1)).save(record);
    }
}
