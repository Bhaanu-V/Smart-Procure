package com.smartprocure.dto;

import com.smartprocure.model.enums.UrgencyLevel;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public class CreatePurchaseRequestDTO {

    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 200, message = "Title must be between 3 and 200 characters")
    private String title;

    private String description;

    @NotBlank(message = "Category is required")
    private String category;

    @NotNull(message = "Estimated cost is required")
    @DecimalMin(value = "0.01", message = "Estimated cost must be greater than zero")
    private BigDecimal estimatedCost;

    private UrgencyLevel urgency = UrgencyLevel.MEDIUM;

    private Boolean isDraft = false;

    public CreatePurchaseRequestDTO() {}

    public CreatePurchaseRequestDTO(String title, String description, String category, BigDecimal estimatedCost) {
        this(title, description, category, estimatedCost, UrgencyLevel.MEDIUM, false);
    }

    public CreatePurchaseRequestDTO(String title, String description, String category, BigDecimal estimatedCost, UrgencyLevel urgency) {
        this(title, description, category, estimatedCost, urgency, false);
    }

    public CreatePurchaseRequestDTO(String title, String description, String category, BigDecimal estimatedCost, UrgencyLevel urgency, Boolean isDraft) {
        this.title = title;
        this.description = description;
        this.category = category;
        this.estimatedCost = estimatedCost;
        this.urgency = urgency != null ? urgency : UrgencyLevel.MEDIUM;
        this.isDraft = isDraft != null ? isDraft : false;
    }


    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public BigDecimal getEstimatedCost() { return estimatedCost; }
    public void setEstimatedCost(BigDecimal estimatedCost) { this.estimatedCost = estimatedCost; }

    public UrgencyLevel getUrgency() { return urgency; }
    public void setUrgency(UrgencyLevel urgency) { this.urgency = urgency; }

    public Boolean getIsDraft() { return isDraft; }
    public void setIsDraft(Boolean isDraft) { this.isDraft = isDraft; }
}

