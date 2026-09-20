package com.smartprocure.service;

import com.smartprocure.dto.AuditEventDTO;
import com.smartprocure.model.entity.AuditEvent;
import com.smartprocure.model.entity.PurchaseRequest;
import com.smartprocure.repository.AuditEventRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuditEventService {

    private final AuditEventRepository auditEventRepository;

    public AuditEventService(AuditEventRepository auditEventRepository) {
        this.auditEventRepository = auditEventRepository;
    }

    @Transactional
    public void logEvent(PurchaseRequest pr, String actorName, String actorRole, String action, String previousStatus, String newStatus, String comment) {
        AuditEvent event = new AuditEvent();
        event.setPurchaseRequest(pr);
        event.setActorName(actorName);
        event.setActorRole(actorRole);
        event.setAction(action);
        event.setPreviousStatus(previousStatus);
        event.setNewStatus(newStatus);
        event.setComment(comment);
        auditEventRepository.save(event);
    }

    public List<AuditEventDTO> getTimelineForRequest(Long requestId) {
        return auditEventRepository.findByPurchaseRequestIdOrderByCreatedAtAsc(requestId)
                .stream()
                .map(e -> new AuditEventDTO(
                        e.getId(),
                        e.getPurchaseRequest().getId(),
                        e.getActorName(),
                        e.getActorRole(),
                        e.getAction(),
                        e.getPreviousStatus(),
                        e.getNewStatus(),
                        e.getComment(),
                        e.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }
}
