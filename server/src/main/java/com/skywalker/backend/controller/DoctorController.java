package com.skywalker.backend.controller;

import com.skywalker.backend.dto.DoctorScheduleDTO;
import com.skywalker.backend.dto.Response;
import com.skywalker.backend.dto.SlotGenerationRequest;
import com.skywalker.backend.model.Doctor;
import com.skywalker.backend.service.impl.DoctorScheduleService;
import com.skywalker.backend.service.impl.DoctorService;
import com.skywalker.backend.service.impl.TimeSlotService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorService doctorService;
    private final DoctorScheduleService scheduleService;
    private final TimeSlotService timeSlotService;

    @GetMapping
    public ResponseEntity<Response> getAllDoctors(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String specialty,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Response response = doctorService.getAllDoctorsPaginated(search, specialty, pageable);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    
    @GetMapping("/specializations")
    public ResponseEntity<Response> getAllSpecializations() {
        Response response = doctorService.getAllSpecializations();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Response> getDoctorById(@PathVariable Long id) {
        Response response = doctorService.getDoctorById(id);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/specialization/{spec}")
    public ResponseEntity<Response> getDoctorsBySpecialization(@PathVariable String spec) {
        Response response = doctorService.getDoctorsBySpecialization(spec);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Response> updateDoctor(@PathVariable Long id, @RequestBody Doctor request) {
        Response response = doctorService.updateDoctor(id, request);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Response> deleteDoctor(@PathVariable Long id) {
        Response response = doctorService.deleteDoctor(id);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // Schedule Management Endpoints
    @PostMapping("/{doctorId}/schedule")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_DOCTOR')")
    public ResponseEntity<Response> setDoctorSchedule(
            @PathVariable Long doctorId,
            @RequestBody List<DoctorScheduleDTO> schedules) {
        Response response = scheduleService.addOrUpdateSchedule(doctorId, schedules);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/{doctorId}/schedule")
    public ResponseEntity<Response> getDoctorSchedule(@PathVariable Long doctorId) {
        Response response = scheduleService.getDoctorSchedule(doctorId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // Time Slot Management Endpoints
    @PostMapping("/{doctorId}/slots/generate")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_DOCTOR')")
    public ResponseEntity<Response> generateTimeSlots(
            @PathVariable Long doctorId,
            @RequestBody SlotGenerationRequest request) {
        Response response = timeSlotService.generateTimeSlots(doctorId, request);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/{doctorId}/slots")
    public ResponseEntity<Response> getAvailableSlots(
            @PathVariable Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        Response response = timeSlotService.getAvailableSlots(doctorId, date);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
