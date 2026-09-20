package com.smartprocure.dto;

import java.time.LocalDateTime;

public class DuplicateWarningDTO {
    private boolean possibleDuplicateFound;
    private Long existingRequestId;
    private String existingRequestNumber;
    private String existingTitle;
    private String category;
    private String employeeName;
    private LocalDateTime createdDate;
    private String warningMessage;

    public DuplicateWarningDTO() {}

    public DuplicateWarningDTO(boolean possibleDuplicateFound, Long existingRequestId, String existingRequestNumber, String existingTitle, String category, String employeeName, LocalDateTime createdDate, String warningMessage) {
        this.possibleDuplicateFound = possibleDuplicateFound;
        this.existingRequestId = existingRequestId;
        this.existingRequestNumber = existingRequestNumber;
        this.existingTitle = existingTitle;
        this.category = category;
        this.employeeName = employeeName;
        this.createdDate = createdDate;
        this.warningMessage = warningMessage;
    }

    public boolean isPossibleDuplicateFound() { return possibleDuplicateFound; }
    public void setPossibleDuplicateFound(boolean possibleDuplicateFound) { this.possibleDuplicateFound = possibleDuplicateFound; }

    public Long getExistingRequestId() { return existingRequestId; }
    public void setExistingRequestId(Long existingRequestId) { this.existingRequestId = existingRequestId; }

    public String getExistingRequestNumber() { return existingRequestNumber; }
    public void setExistingRequestNumber(String existingRequestNumber) { this.existingRequestNumber = existingRequestNumber; }

    public String getExistingTitle() { return existingTitle; }
    public void setExistingTitle(String existingTitle) { this.existingTitle = existingTitle; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }

    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }

    public String getWarningMessage() { return warningMessage; }
    public void setWarningMessage(String warningMessage) { this.warningMessage = warningMessage; }
}
