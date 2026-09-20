package com.smartprocure.repository;

import com.smartprocure.model.entity.SlaRecord;
import com.smartprocure.model.enums.SlaStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SlaRecordRepository extends JpaRepository<SlaRecord, Long> {
    Optional<SlaRecord> findByPurchaseRequestId(Long purchaseRequestId);
    List<SlaRecord> findBySlaStatus(SlaStatus slaStatus);
    long countBySlaStatus(SlaStatus slaStatus);
}
