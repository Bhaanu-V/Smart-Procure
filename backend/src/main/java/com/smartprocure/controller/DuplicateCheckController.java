package com.smartprocure.controller;

import com.smartprocure.dto.DuplicateWarningDTO;
import com.smartprocure.service.DuplicateDetectionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/requests")
public class DuplicateCheckController {

    private final DuplicateDetectionService duplicateDetectionService;

    public DuplicateCheckController(DuplicateDetectionService duplicateDetectionService) {
        this.duplicateDetectionService = duplicateDetectionService;
    }

    public static class DuplicateCheckRequest {
        private String title;
        private String category;
        private Long departmentId;

        public DuplicateCheckRequest() {}
        public DuplicateCheckRequest(String title, String category, Long departmentId) {
            this.title = title;
            this.category = category;
            this.departmentId = departmentId;
        }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }

        public Long getDepartmentId() { return departmentId; }
        public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }
    }

    @PostMapping("/check-duplicate")
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'MANAGER', 'ADMIN')")
    public ResponseEntity<DuplicateWarningDTO> checkDuplicate(@RequestBody DuplicateCheckRequest request) {
        return ResponseEntity.ok(duplicateDetectionService.checkDuplicate(
                request.getTitle(),
                request.getCategory(),
                request.getDepartmentId()
        ));
    }
}
