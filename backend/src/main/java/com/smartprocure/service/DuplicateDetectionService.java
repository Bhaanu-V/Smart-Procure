package com.smartprocure.service;

import com.smartprocure.dto.DuplicateWarningDTO;
import com.smartprocure.model.entity.PurchaseRequest;
import com.smartprocure.repository.PurchaseRequestRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DuplicateDetectionService {

    private final PurchaseRequestRepository purchaseRequestRepository;

    public DuplicateDetectionService(PurchaseRequestRepository purchaseRequestRepository) {
        this.purchaseRequestRepository = purchaseRequestRepository;
    }

    public DuplicateWarningDTO checkDuplicate(String title, String category, Long departmentId) {
        if (title == null || departmentId == null) {
            return new DuplicateWarningDTO(false, null, null, null, null, null, null, null);
        }

        LocalDateTime cutoff = LocalDateTime.now().minusDays(30);
        List<PurchaseRequest> recentRequests = purchaseRequestRepository.findRecentByDepartment(departmentId, cutoff);

        String normalizedTitle = title.trim().toLowerCase();

        for (PurchaseRequest existing : recentRequests) {
            String existingTitle = existing.getTitle().trim().toLowerCase();
            
            // Check exact or partial substring match or high similarity
            if (existingTitle.equals(normalizedTitle) ||
                existingTitle.contains(normalizedTitle) ||
                normalizedTitle.contains(existingTitle) ||
                calculateSimilarity(normalizedTitle, existingTitle) > 0.75) {

                String message = String.format("Possible duplicate detected! Order '%s' (%s) was submitted by %s in department on %s.",
                        existing.getTitle(),
                        existing.getRequestNumber(),
                        existing.getEmployee() != null ? existing.getEmployee().getFullName() : "Employee",
                        existing.getCreatedAt().toLocalDate().toString());

                return new DuplicateWarningDTO(
                        true,
                        existing.getId(),
                        existing.getRequestNumber(),
                        existing.getTitle(),
                        existing.getCategory(),
                        existing.getEmployee() != null ? existing.getEmployee().getFullName() : "Employee",
                        existing.getCreatedAt(),
                        message
                );
            }
        }

        return new DuplicateWarningDTO(false, null, null, null, null, null, null, "No duplicate purchases found.");
    }

    private double calculateSimilarity(String s1, String s2) {
        int maxLength = Math.max(s1.length(), s2.length());
        if (maxLength == 0) return 1.0;
        int editDistance = levenshteinDistance(s1, s2);
        return (maxLength - editDistance) / (double) maxLength;
    }

    private int levenshteinDistance(String lhs, String rhs) {
        int len0 = lhs.length() + 1;
        int len1 = rhs.length() + 1;
        int[] cost = new int[len0];
        int[] newcost = new int[len0];

        for (int i = 0; i < len0; i++) cost[i] = i;

        for (int j = 1; j < len1; j++) {
            newcost[0] = j;
            for (int i = 1; i < len0; i++) {
                int match = (lhs.charAt(i - 1) == rhs.charAt(j - 1)) ? 0 : 1;
                int costReplace = cost[i - 1] + match;
                int costInsert = cost[i] + 1;
                int costDelete = newcost[i - 1] + 1;
                newcost[i] = Math.min(Math.min(costInsert, costDelete), costReplace);
            }
            int[] swap = cost; cost = newcost; newcost = swap;
        }

        return cost[len0 - 1];
    }
}
