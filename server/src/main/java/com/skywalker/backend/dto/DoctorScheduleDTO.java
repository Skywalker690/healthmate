package com.skywalker.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DoctorScheduleDTO {
    private Long id;
    private Long doctorId;
    private DayOfWeek dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
    private Boolean isActive;
}
