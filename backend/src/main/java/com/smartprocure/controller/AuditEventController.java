package com.smartprocure.controller;

import com.smartprocure.dto.AuditEventDTO;
import com.smartprocure.service.AuditEventService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/requests")
public class AuditEventController {

    private final AuditEventService auditEventService;

    public AuditEventController(AuditEventService auditEventService) {
        this.auditEventService = auditEventService;
    }

    @GetMapping("/{id}/timeline")
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'MANAGER', 'ADMIN')")
    public ResponseEntity<List<AuditEventDTO>> getRequestTimeline(@PathVariable Long id) {
        return ResponseEntity.ok(auditEventService.getTimelineForRequest(id));
    }
}
