package com.skywalker.backend.service.impl;

import com.skywalker.backend.domain.STATUS;
import com.skywalker.backend.dto.AppointmentDTO;
import com.skywalker.backend.dto.Response;
import com.skywalker.backend.exception.OurException;
import com.skywalker.backend.model.Appointment;
import com.skywalker.backend.model.Doctor;
import com.skywalker.backend.model.Patient;
import com.skywalker.backend.repository.AppointmentRepository;
import com.skywalker.backend.repository.DoctorRepository;
import com.skywalker.backend.repository.PatientRepository;
import com.skywalker.backend.security.Utils;
import com.skywalker.backend.service.repo.IAppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentService implements IAppointmentService {

    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;


    @Override
    public Response createAppointment(Long patientId, Long doctorId, Appointment appointmentRequest) {
        Response response = new Response();
        try {
            // Fetch Doctor and Patient first
            Doctor doctor = doctorRepository.findById(doctorId)
                    .orElseThrow(() -> new OurException("Doctor not found"));
            Patient patient = patientRepository.findById(patientId)
                    .orElseThrow(() -> new OurException("Patient not found"));

            // Check if doctor is available at a given dateTime
            if (!isDoctorAvailable(doctorId, appointmentRequest.getAppointmentDateTime())) {
                response.setStatusCode(400);
                response.setMessage("Doctor is not available at the selected time");
                return response;
            }

            // Set doctor and patient in Appointment entity
            appointmentRequest.setDoctor(doctor);
            appointmentRequest.setPatient(patient);

            // Generate Appointment Code if null
            if (appointmentRequest.getAppointmentCode() == null || appointmentRequest.getAppointmentCode().isEmpty()) {
                appointmentRequest.setAppointmentCode(Utils.generateAppointmentCode(10));
            }

            Appointment savedAppointment = appointmentRepository.save(appointmentRequest);
            AppointmentDTO appointmentDTO = Utils.mapAppointmentToDTO(savedAppointment);

            // Send notifications
            notificationService.sendNotification(
                doctor.getUser().getId(),
                "New appointment booked by " + patient.getUser().getName() + 
                " on " + appointmentRequest.getAppointmentDateTime()
            );
            
            notificationService.sendNotification(
                patient.getUser().getId(),
                "Your appointment with Dr. " + doctor.getUser().getName() + 
                " is confirmed for " + appointmentRequest.getAppointmentDateTime()
            );

            // Log the action
            auditLogService.logAction(
                patient.getUser().getId(),
                "APPOINTMENT_CREATED",
                "Appointment created with doctor ID: " + doctorId
            );

            response.setStatusCode(200);
            response.setMessage("Appointment created successfully");
            response.setAppointment(appointmentDTO);

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error creating appointment: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getAppointmentById(Long id) {
        Response response = new Response();
        try {
            Appointment appointment = appointmentRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Appointment not found"));

            AppointmentDTO appointmentDTO = Utils.mapAppointmentToDTO(appointment);
            response.setStatusCode(200);
            response.setMessage("Appointment found");
            response.setAppointment(appointmentDTO);

        } catch (Exception e) {
            response.setStatusCode(404);
            response.setMessage("Error fetching appointment: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getAppointmentsByDoctor(Long doctorId) {
        Response response = new Response();
        try {
            List<Appointment> appointments = appointmentRepository.findByDoctorId(doctorId);
            LocalDate today = LocalDate.now();
            
            // Filter to show only upcoming appointments (today and future)
            // Exclude completed and canceled appointments
            List<AppointmentDTO> appointmentDTOList = appointments.stream()
                    .filter(a -> a.getAppointmentDateTime().toLocalDate().compareTo(today) >= 0)
                    .filter(a -> a.getStatus() != STATUS.COMPLETED && a.getStatus() != STATUS.CANCELED)
                    .sorted(Comparator.comparing(Appointment::getAppointmentDateTime))
                    .map(Utils::mapAppointmentToDTO)
                    .collect(Collectors.toList());

            response.setStatusCode(200);
            response.setMessage("Appointments fetched successfully");
            response.setAppointmentList(appointmentDTOList);

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error fetching appointments: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getAppointmentsByPatient(Long patientId) {
        Response response = new Response();
        try {
            List<Appointment> appointments = appointmentRepository.findByPatientId(patientId);
            LocalDate today = LocalDate.now();
            
            // Filter to show only upcoming appointments (today and future)
            // Exclude completed and canceled appointments
            List<AppointmentDTO> appointmentDTOList = appointments.stream()
                    .filter(a -> a.getAppointmentDateTime().toLocalDate().compareTo(today) >= 0)
                    .filter(a -> a.getStatus() != STATUS.COMPLETED && a.getStatus() != STATUS.CANCELED)
                    .sorted(Comparator.comparing(Appointment::getAppointmentDateTime))
                    .map(Utils::mapAppointmentToDTO)
                    .collect(Collectors.toList());

            response.setStatusCode(200);
            response.setMessage("Appointments fetched successfully");
            response.setAppointmentList(appointmentDTOList);

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error fetching appointments: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getAllAppointments() {
        Response response = new Response();
        try {
            List<Appointment> appointments = appointmentRepository.findAll();
            List<AppointmentDTO> appointmentDTOList = appointments.stream()
                    .map(Utils::mapAppointmentToDTO)
                    .collect(Collectors.toList());

            response.setStatusCode(200);
            response.setMessage("All appointments fetched successfully");
            response.setAppointmentList(appointmentDTOList);

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error fetching all appointments: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getAllAppointmentsPaginated(String status, LocalDate startDate, LocalDate endDate, int page, int size) {
        Response response = new Response();
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Appointment> appointmentPage;
            
            if (status != null && startDate != null && endDate != null) {
                LocalDateTime startDateTime = startDate.atStartOfDay();
                LocalDateTime endDateTime = endDate.atTime(23, 59, 59);
                appointmentPage = appointmentRepository.findByStatusAndDateRange(
                    STATUS.valueOf(status.toUpperCase()), 
                    startDateTime, 
                    endDateTime, 
                    pageable
                );
            } else if (status != null) {
                appointmentPage = appointmentRepository.findByStatus(STATUS.valueOf(status.toUpperCase()), pageable);
            } else if (startDate != null && endDate != null) {
                LocalDateTime startDateTime = startDate.atStartOfDay();
                LocalDateTime endDateTime = endDate.atTime(23, 59, 59);
                appointmentPage = appointmentRepository.findByDateRange(startDateTime, endDateTime, pageable);
            } else {
                appointmentPage = appointmentRepository.findAll(pageable);
            }
            
            List<AppointmentDTO> appointmentDTOList = appointmentPage.getContent().stream()
                    .map(Utils::mapAppointmentToDTO)
                    .collect(Collectors.toList());
            
            response.setAppointmentList(appointmentDTOList);
            response.setStatusCode(200);
            response.setMessage("Appointments fetched successfully");
            
            // Add pagination metadata
            Map<String, Object> paginationData = new HashMap<>();
            paginationData.put("content", appointmentDTOList);
            paginationData.put("currentPage", appointmentPage.getNumber());
            paginationData.put("totalPages", appointmentPage.getTotalPages());
            paginationData.put("totalElements", appointmentPage.getTotalElements());
            paginationData.put("pageSize", appointmentPage.getSize());
            paginationData.put("hasNext", appointmentPage.hasNext());
            paginationData.put("hasPrevious", appointmentPage.hasPrevious());
            response.setData(paginationData);
            
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error fetching appointments: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response updateAppointmentStatus(Long id, @RequestBody STATUS status) {
        Response response = new Response();
        try {
            Appointment appointment = appointmentRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Appointment not found"));

            appointment.setStatus(status);
            Appointment updatedAppointment = appointmentRepository.save(appointment);

            // Send notification to patient about status change
            notificationService.sendNotification(
                appointment.getPatient().getUser().getId(),
                "Your appointment status has been updated to: " + status.toString()
            );

            // Log the action
            auditLogService.logAction(
                appointment.getDoctor().getUser().getId(),
                "APPOINTMENT_STATUS_UPDATED",
                "Appointment ID: " + id + " status changed to " + status.toString()
            );

            AppointmentDTO appointmentDTO = Utils.mapAppointmentToDTO(updatedAppointment);
            response.setStatusCode(200);
            response.setMessage("Appointment status updated successfully");
            response.setAppointment(appointmentDTO);

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error updating appointment: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response deleteAppointment(Long id) {
        Response response = new Response();
        try {
            appointmentRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Appointment not found"));

            appointmentRepository.deleteById(id);
            response.setStatusCode(200);
            response.setMessage("Appointment deleted successfully");

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error deleting appointment: " + e.getMessage());
        }
        return response;
    }


    public Response getAppointmentByCode(String appointmentCode) {
        Response response = new Response();
        try {
            Appointment appointment = appointmentRepository.findByAppointmentCode(appointmentCode)
                    .orElseThrow(() -> new RuntimeException("Appointment not found"));

            response.setStatusCode(200);
            response.setAppointment(Utils.mapAppointmentToDTO(appointment));
        } catch (RuntimeException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error fetching appointment: " + e.getMessage());
        }
        return response;
    }



    // Helper
    private boolean isDoctorAvailable(Long doctorId, LocalDateTime appointmentDateTime) {
        List<Appointment> existingAppointments = appointmentRepository.findByDoctorIdAndAppointmentDateTime(doctorId, appointmentDateTime);
        return existingAppointments.isEmpty();
    }
}
