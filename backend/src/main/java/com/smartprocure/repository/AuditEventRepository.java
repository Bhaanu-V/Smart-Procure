package com.smartprocure.repository;

import com.smartprocure.model.entity.AuditEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditEventRepository extends JpaRepository<AuditEvent, Long> {
    List<AuditEvent> findByPurchaseRequestIdOrderByCreatedAtAsc(Long purchaseRequestId);
    List<AuditEvent> findTop50ByOrderByCreatedAtDesc();
}
