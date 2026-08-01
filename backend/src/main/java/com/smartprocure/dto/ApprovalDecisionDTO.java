package com.smartprocure.dto;

import com.smartprocure.model.enums.ApprovalAction;
import jakarta.validation.constraints.NotNull;

public class ApprovalDecisionDTO {

    @NotNull(message = "Approval action is required (APPROVE or REJECT)")
    private ApprovalAction action;

    private String comments;

    public ApprovalDecisionDTO() {}

    public ApprovalDecisionDTO(ApprovalAction action, String comments) {
        this.action = action;
        this.comments = comments;
    }

    public ApprovalAction getAction() { return action; }
    public void setAction(ApprovalAction action) { this.action = action; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }
}
