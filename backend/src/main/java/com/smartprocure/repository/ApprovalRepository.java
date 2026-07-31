package com.smartprocure.repository;

import com.smartprocure.model.entity.Approval;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApprovalRepository extends JpaRepository<Approval, Long> {
    List<Approval> findByPurchaseRequestIdOrderByActionTimestampDesc(Long purchaseRequestId);
}
