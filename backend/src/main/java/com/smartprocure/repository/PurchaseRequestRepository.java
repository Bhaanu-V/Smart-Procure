package com.smartprocure.repository;

import com.smartprocure.model.entity.PurchaseRequest;
import com.smartprocure.model.enums.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PurchaseRequestRepository extends JpaRepository<PurchaseRequest, Long> {
    List<PurchaseRequest> findByEmployeeIdOrderByCreatedAtDesc(Long employeeId);
    List<PurchaseRequest> findByDepartmentIdAndStatusOrderByCreatedAtDesc(Long departmentId, RequestStatus status);
    List<PurchaseRequest> findByDepartmentIdOrderByCreatedAtDesc(Long departmentId);
    Optional<PurchaseRequest> findByRequestNumber(String requestNumber);
}
