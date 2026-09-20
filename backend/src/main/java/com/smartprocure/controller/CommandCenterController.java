package com.smartprocure.controller;

import com.smartprocure.dto.CommandCenterMetricsDTO;
import com.smartprocure.service.CommandCenterService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/command-center")
public class CommandCenterController {

    private final CommandCenterService commandCenterService;

    public CommandCenterController(CommandCenterService commandCenterService) {
        this.commandCenterService = commandCenterService;
    }

    @GetMapping("/metrics")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<CommandCenterMetricsDTO> getCommandCenterMetrics() {
        return ResponseEntity.ok(commandCenterService.getCommandCenterMetrics());
    }
}
