package com.skywalker.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TopDoctorDTO {
    private Long doctorId;
    private String doctorName;
    private String specialization;
    private Long appointmentCount;
}
