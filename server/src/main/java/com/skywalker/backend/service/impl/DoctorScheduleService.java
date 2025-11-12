package com.skywalker.backend.service.impl;

import com.skywalker.backend.dto.DoctorScheduleDTO;
import com.skywalker.backend.dto.Response;
import com.skywalker.backend.exception.OurException;
import com.skywalker.backend.model.Doctor;
import com.skywalker.backend.model.DoctorSchedule;
import com.skywalker.backend.repository.DoctorRepository;
import com.skywalker.backend.repository.DoctorScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorScheduleService {

    private final DoctorScheduleRepository scheduleRepository;
    private final DoctorRepository doctorRepository;

    @Transactional
    public Response addOrUpdateSchedule(Long doctorId, List<DoctorScheduleDTO> scheduleDTOs) {
        Response response = new Response();
        try {
            Doctor doctor = doctorRepository.findById(doctorId)
                    .orElseThrow(() -> new OurException("Doctor not found"));

            // Clear existing schedules
            scheduleRepository.deleteByDoctorId(doctorId);

            // Add new schedules
            List<DoctorSchedule> schedules = scheduleDTOs.stream()
                    .map(dto -> {
                        DoctorSchedule schedule = new DoctorSchedule();
                        schedule.setDoctor(doctor);
                        schedule.setDayOfWeek(dto.getDayOfWeek());
                        schedule.setStartTime(dto.getStartTime());
                        schedule.setEndTime(dto.getEndTime());
                        schedule.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);
                        return schedule;
                    })
                    .collect(Collectors.toList());

            List<DoctorSchedule> savedSchedules = scheduleRepository.saveAll(schedules);
            List<DoctorScheduleDTO> resultDTOs = savedSchedules.stream()
                    .map(this::mapToDTO)
                    .collect(Collectors.toList());

            response.setStatusCode(200);
            response.setMessage("Schedule updated successfully");
            response.setScheduleList(resultDTOs);

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error updating schedule: " + e.getMessage());
        }
        return response;
    }

    public Response getDoctorSchedule(Long doctorId) {
        Response response = new Response();
        try {
            List<DoctorSchedule> schedules = scheduleRepository.findByDoctorIdAndIsActiveTrue(doctorId);
            List<DoctorScheduleDTO> scheduleDTOs = schedules.stream()
                    .map(this::mapToDTO)
                    .collect(Collectors.toList());

            response.setStatusCode(200);
            response.setMessage("Schedule fetched successfully");
            response.setScheduleList(scheduleDTOs);

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error fetching schedule: " + e.getMessage());
        }
        return response;
    }

    public List<DoctorSchedule> getDoctorScheduleForDay(Long doctorId, DayOfWeek dayOfWeek) {
        return scheduleRepository.findByDoctorIdAndDayOfWeekAndIsActiveTrue(doctorId, dayOfWeek);
    }

    private DoctorScheduleDTO mapToDTO(DoctorSchedule schedule) {
        DoctorScheduleDTO dto = new DoctorScheduleDTO();
        dto.setId(schedule.getId());
        dto.setDoctorId(schedule.getDoctor().getId());
        dto.setDayOfWeek(schedule.getDayOfWeek());
        dto.setStartTime(schedule.getStartTime());
        dto.setEndTime(schedule.getEndTime());
        dto.setIsActive(schedule.getIsActive());
        return dto;
    }
}
