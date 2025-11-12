package com.skywalker.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.skywalker.backend.domain.SlotStatus;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TimeSlotDTO {
    private Long id;
    private Long doctorId;
    private String doctorName;
    private LocalDate slotDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private SlotStatus status;
    private Long appointmentId;
}
