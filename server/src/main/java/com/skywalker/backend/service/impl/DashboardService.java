package com.skywalker.backend.service.impl;

import com.skywalker.backend.domain.STATUS;
import com.skywalker.backend.domain.USER_ROLE;
import com.skywalker.backend.dto.AppointmentDTO;
import com.skywalker.backend.dto.DashboardStatsDTO;
import com.skywalker.backend.dto.Response;
import com.skywalker.backend.dto.TopDoctorDTO;
import com.skywalker.backend.exception.OurException;
import com.skywalker.backend.model.Appointment;
import com.skywalker.backend.repository.AppointmentRepository;
import com.skywalker.backend.repository.DoctorRepository;
import com.skywalker.backend.repository.PatientRepository;
import com.skywalker.backend.repository.UserRepository;
import com.skywalker.backend.security.Utils;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;

    @Cacheable(value = "dashboardStats", key = "'admin'")
    public Response getAdminDashboard() {
        Response response = new Response();
        try {
            DashboardStatsDTO stats = new DashboardStatsDTO();

            // Total counts
            stats.setTotalUsers(userRepository.count());
            stats.setTotalDoctors(doctorRepository.count());
            stats.setTotalPatients(patientRepository.count());
            stats.setTotalAppointments(appointmentRepository.count());

            // Time-based appointment counts
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime startOfDay = now.toLocalDate().atStartOfDay();
            LocalDateTime startOfWeek = now.minusDays(7);
            LocalDateTime startOfMonth = now.minusDays(30);

            List<Appointment> allAppointments = appointmentRepository.findAll();
            LocalDate today = LocalDate.now();
            
            // Filter to only upcoming appointments (today and future, excluding completed/cancelled)
            List<Appointment> upcomingAppointments = allAppointments.stream()
                    .filter(a -> a != null && a.getAppointmentDateTime() != null)
                    .filter(a -> a.getAppointmentDateTime().toLocalDate().compareTo(today) >= 0)
                    .filter(a -> a.getStatus() != STATUS.COMPLETED && a.getStatus() != STATUS.CANCELED)
                    .collect(Collectors.toList());
            
            stats.setTodayAppointments(upcomingAppointments.stream()
                    .filter(a -> a.getAppointmentDateTime().isAfter(startOfDay))
                    .count());

            stats.setWeeklyAppointments(upcomingAppointments.stream()
                    .filter(a -> a.getAppointmentDateTime().isAfter(startOfWeek))
                    .count());

            stats.setMonthlyAppointments(upcomingAppointments.stream()
                    .filter(a -> a.getAppointmentDateTime().isAfter(startOfMonth))
                    .count());

            // Appointment status counts (only for upcoming appointments)
            stats.setConfirmedAppointments(upcomingAppointments.stream()
                    .filter(a -> a.getStatus() == STATUS.CONFIRMED)
                    .count());

            stats.setPendingAppointments(upcomingAppointments.stream()
                    .filter(a -> a.getStatus() == STATUS.SCHEDULED)
                    .count());

            // Note: Cancelled appointments are excluded from upcoming appointments filter
            // So this will always be 0. Keeping it for consistency but it's filtered out.
            stats.setCancelledAppointments(0L);

            // Top consulted doctors (based on upcoming appointments only)
            Map<Long, Long> doctorAppointmentCount = upcomingAppointments.stream()
                    .filter(a -> a.getDoctor() != null)
                    .collect(Collectors.groupingBy(
                            a -> a.getDoctor().getId(),
                            Collectors.counting()
                    ));

            List<TopDoctorDTO> topDoctors = doctorAppointmentCount.entrySet().stream()
                    .sorted(Map.Entry.<Long, Long>comparingByValue().reversed())
                    .limit(5)
                    .map(entry -> {
                        var doctor = doctorRepository.findById(entry.getKey()).orElse(null);
                        if (doctor != null) {
                            return new TopDoctorDTO(
                                    doctor.getId(),
                                    doctor.getUser().getName(),
                                    doctor.getSpecialization(),
                                    entry.getValue()
                            );
                        }
                        return null;
                    })
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());

            stats.setTopConsultedDoctors(topDoctors);

            response.setStatusCode(200);
            response.setMessage("Admin dashboard stats fetched successfully");
            response.setDashboardStats(stats);

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error fetching dashboard stats: " + e.getMessage());
        }
        return response;
    }

    @Cacheable(value = "dashboardStats", key = "'doctor-' + #doctorId")
    public Response getDoctorDashboard(Long doctorId) {
        Response response = new Response();
        try {
            DashboardStatsDTO stats = new DashboardStatsDTO();

            List<Appointment> doctorAppointments = appointmentRepository.findByDoctorId(doctorId);
            LocalDateTime now = LocalDateTime.now();

            // Appointment status counts
            stats.setUpcomingAppointments(doctorAppointments.stream()
                    .filter(a -> a.getAppointmentDateTime().isAfter(now) && 
                                 a.getStatus() == STATUS.SCHEDULED)
                    .count());

            stats.setCompletedAppointments(doctorAppointments.stream()
                    .filter(a -> a.getStatus() == STATUS.COMPLETED)
                    .count());

            stats.setCancelledAppointments(doctorAppointments.stream()
                    .filter(a -> a.getStatus() == STATUS.CANCELED)
                    .count());

            // Appointments by month (last 6 months)
            Map<String, Long> appointmentsByMonth = new LinkedHashMap<>();
            for (int i = 5; i >= 0; i--) {
                YearMonth month = YearMonth.now().minusMonths(i);
                LocalDateTime monthStart = month.atDay(1).atStartOfDay();
                LocalDateTime monthEnd = month.atEndOfMonth().atTime(23, 59, 59);

                long count = doctorAppointments.stream()
                        .filter(a -> a.getAppointmentDateTime().isAfter(monthStart) &&
                                     a.getAppointmentDateTime().isBefore(monthEnd))
                        .count();

                appointmentsByMonth.put(month.format(DateTimeFormatter.ofPattern("MMM yyyy")), count);
            }
            stats.setAppointmentsByMonth(appointmentsByMonth);

            // Upcoming appointments only (today and future, excluding completed/cancelled)
            LocalDate today = LocalDate.now();
            List<AppointmentDTO> recentAppointments = doctorAppointments.stream()
                    .filter(a -> a != null && a.getAppointmentDateTime() != null)
                    .filter(a -> a.getAppointmentDateTime().toLocalDate().compareTo(today) >= 0)
                    .filter(a -> a.getStatus() != STATUS.COMPLETED && a.getStatus() != STATUS.CANCELED)
                    .sorted(Comparator.comparing(Appointment::getAppointmentDateTime))
                    .limit(10)
                    .map(Utils::mapAppointmentToDTO)
                    .collect(Collectors.toList());
            stats.setRecentAppointments(recentAppointments);

            response.setStatusCode(200);
            response.setMessage("Doctor dashboard stats fetched successfully");
            response.setDashboardStats(stats);

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error fetching dashboard stats: " + e.getMessage());
        }
        return response;
    }
}
