package com.skywalker.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Response {

    private int statusCode;
    private String message;

    private String role;
    private String token;

    private UserDTO user;
    private DoctorDTO doctor;
    private PatientDTO patient;
    private AppointmentDTO appointment;

    private List<UserDTO> userList;
    private List<DoctorDTO> doctorList;
    private List<PatientDTO> patientList;
    private List<AppointmentDTO> appointmentList;

    // New fields for enhanced features
    private DoctorScheduleDTO schedule;
    private List<DoctorScheduleDTO> scheduleList;
    private TimeSlotDTO timeSlot;
    private List<TimeSlotDTO> timeSlotList;
    private NotificationDTO notification;
    private List<NotificationDTO> notificationList;
    private DashboardStatsDTO dashboardStats;
    
    // Generic data field for pagination and other metadata
    private Object data;
}
