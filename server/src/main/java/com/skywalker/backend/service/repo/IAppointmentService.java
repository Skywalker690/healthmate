package com.skywalker.backend.service.repo;

import com.skywalker.backend.domain.STATUS;
import com.skywalker.backend.dto.Response;
import com.skywalker.backend.model.Appointment;

import java.time.LocalDate;

public interface IAppointmentService {

    Response createAppointment(Long patientId, Long doctorId, Appointment appointmentRequest);

    Response getAppointmentById(Long id);

    Response getAppointmentsByDoctor(Long doctorId);

    Response getAppointmentByCode(String appointmentCode);

    Response getAppointmentsByPatient(Long patientId);

    Response getAllAppointments();
    
    Response getAllAppointmentsPaginated(String status, LocalDate startDate, LocalDate endDate, int page, int size);

    Response updateAppointmentStatus(Long id, STATUS  status);

    Response deleteAppointment(Long id);
}
