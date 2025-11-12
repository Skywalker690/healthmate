package com.skywalker.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DashboardStatsDTO {
    // Admin Dashboard
    private Long totalUsers;
    private Long totalDoctors;
    private Long totalPatients;
    private Long totalAppointments;
    private Long todayAppointments;
    private Long weeklyAppointments;
    private Long monthlyAppointments;
    private Long confirmedAppointments;
    private Long pendingAppointments;
    private List<TopDoctorDTO> topConsultedDoctors;
    
    // Doctor Dashboard
    private Long upcomingAppointments;
    private Long completedAppointments;
    private Long cancelledAppointments;
    private Map<String, Long> appointmentsByMonth;
    private List<AppointmentDTO> recentAppointments;
}
