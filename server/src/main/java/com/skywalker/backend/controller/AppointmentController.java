package com.skywalker.backend.controller;

import com.skywalker.backend.domain.STATUS;
import com.skywalker.backend.dto.Response;
import com.skywalker.backend.dto.StatusRequest;
import com.skywalker.backend.model.Appointment;
import com.skywalker.backend.service.impl.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Response> getAllAppointments(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Response response = appointmentService.getAllAppointmentsPaginated(status, startDate, endDate, page, size);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/{patientId}/{doctorId}")
    public ResponseEntity<Response> createAppointment(@PathVariable Long patientId,
                                                      @PathVariable Long doctorId,
                                                      @RequestBody Appointment appointment) {
        Response response = appointmentService.createAppointment(patientId, doctorId, appointment);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Response> getAppointmentById(@PathVariable Long id) {
        Response response = appointmentService.getAppointmentById(id);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/code/{appointmentCode}")
    public ResponseEntity<Response> getAppointmentByCode(@PathVariable String appointmentCode) {
        Response response = appointmentService.getAppointmentByCode(appointmentCode);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_DOCTOR')")
    public ResponseEntity<Response> getAppointmentsByDoctor(@PathVariable Long doctorId) {
        Response response = appointmentService.getAppointmentsByDoctor(doctorId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Response> getAppointmentsByPatient(@PathVariable Long patientId) {
        Response response = appointmentService.getAppointmentsByPatient(patientId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_DOCTOR')")
    public ResponseEntity<Response> updateAppointmentStatus(@PathVariable Long id,
                                                            @RequestBody StatusRequest statusRequest) {
        Response response = appointmentService.updateAppointmentStatus(
                id,
                STATUS.valueOf(statusRequest.getStatus().toUpperCase())
        );
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Response> deleteAppointment(@PathVariable Long id) {
        Response response = appointmentService.deleteAppointment(id);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
