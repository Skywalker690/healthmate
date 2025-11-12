package com.skywalker.backend.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class SlotGenerationRequest {
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer slotDurationMinutes = 30; // Default 30 minutes
}
