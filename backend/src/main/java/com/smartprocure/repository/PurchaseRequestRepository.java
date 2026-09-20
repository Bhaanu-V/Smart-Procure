package com.smartprocure.repository;

import com.smartprocure.model.entity.PurchaseRequest;
import com.smartprocure.model.enums.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PurchaseRequestRepository extends JpaRepository<PurchaseRequest, Long> {
    List<PurchaseRequest> findByEmployeeIdOrderByCreatedAtDesc(Long employeeId);
    List<PurchaseRequest> findByDepartmentIdAndStatusOrderByCreatedAtDesc(Long departmentId, RequestStatus status);
    List<PurchaseRequest> findByStatusOrderByCreatedAtDesc(RequestStatus status);
    List<PurchaseRequest> findByDepartmentIdOrderByCreatedAtDesc(Long departmentId);
    List<PurchaseRequest> findByDepartmentIdOrderByPriorityScoreDescCreatedAtDesc(Long departmentId);
    List<PurchaseRequest> findAllByOrderByPriorityScoreDescCreatedAtDesc();
    Optional<PurchaseRequest> findByRequestNumber(String requestNumber);
    long countByStatus(RequestStatus status);

    @Query("SELECT SUM(pr.estimatedCost) FROM PurchaseRequest pr WHERE pr.status = 'APPROVED'")
    BigDecimal sumTotalApprovedSpend();

    @Query("SELECT pr FROM PurchaseRequest pr WHERE pr.department.id = :deptId AND pr.createdAt >= :cutoff ORDER BY pr.createdAt DESC")
    List<PurchaseRequest> findRecentByDepartment(@Param("deptId") Long deptId, @Param("cutoff") LocalDateTime cutoff);

    @Query("SELECT pr FROM PurchaseRequest pr LEFT JOIN FETCH pr.employee LEFT JOIN FETCH pr.department WHERE LOWER(pr.requestNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(pr.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(pr.category) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(pr.employee.fullName) LIKE LOWER(CONCAT('%', :query, '%')) ORDER BY pr.createdAt DESC")
    List<PurchaseRequest> globalSearch(@Param("query") String query);
}

