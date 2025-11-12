package com.skywalker.backend.service.impl;

import com.skywalker.backend.domain.SlotStatus;
import com.skywalker.backend.dto.Response;
import com.skywalker.backend.dto.SlotGenerationRequest;
import com.skywalker.backend.dto.TimeSlotDTO;
import com.skywalker.backend.exception.OurException;
import com.skywalker.backend.model.Doctor;
import com.skywalker.backend.model.DoctorSchedule;
import com.skywalker.backend.model.TimeSlot;
import com.skywalker.backend.repository.DoctorRepository;
import com.skywalker.backend.repository.TimeSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TimeSlotService {

    private final TimeSlotRepository timeSlotRepository;
    private final DoctorRepository doctorRepository;
    private final DoctorScheduleService scheduleService;

    @Transactional
    public Response generateTimeSlots(Long doctorId, SlotGenerationRequest request) {
        Response response = new Response();
        try {
            Doctor doctor = doctorRepository.findById(doctorId)
                    .orElseThrow(() -> new OurException("Doctor not found"));

            List<TimeSlot> generatedSlots = new ArrayList<>();
            LocalDate currentDate = request.getStartDate();

            while (!currentDate.isAfter(request.getEndDate())) {
                // Get doctor's schedule for this day of week
                List<DoctorSchedule> daySchedules = scheduleService.getDoctorScheduleForDay(
                        doctorId, currentDate.getDayOfWeek());

                for (DoctorSchedule schedule : daySchedules) {
                    if (schedule.getIsActive()) {
                        generatedSlots.addAll(generateSlotsForSchedule(
                                doctor, currentDate, schedule, request.getSlotDurationMinutes()));
                    }
                }

                currentDate = currentDate.plusDays(1);
            }

            List<TimeSlot> savedSlots = timeSlotRepository.saveAll(generatedSlots);
            List<TimeSlotDTO> slotDTOs = savedSlots.stream()
                    .map(this::mapToDTO)
                    .collect(Collectors.toList());

            response.setStatusCode(200);
            response.setMessage(savedSlots.size() + " time slots generated successfully");
            response.setTimeSlotList(slotDTOs);

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error generating time slots: " + e.getMessage());
        }
        return response;
    }

    private List<TimeSlot> generateSlotsForSchedule(Doctor doctor, LocalDate date, 
                                                     DoctorSchedule schedule, Integer durationMinutes) {
        List<TimeSlot> slots = new ArrayList<>();
        LocalTime currentTime = schedule.getStartTime();
        LocalTime endTime = schedule.getEndTime();

        while (currentTime.plusMinutes(durationMinutes).isBefore(endTime) ||
               currentTime.plusMinutes(durationMinutes).equals(endTime)) {
            
            // Check if slot already exists
            if (timeSlotRepository.findByDoctorIdAndSlotDateAndStartTime(
                    doctor.getId(), date, currentTime).isEmpty()) {
                
                TimeSlot slot = new TimeSlot();
                slot.setDoctor(doctor);
                slot.setSlotDate(date);
                slot.setStartTime(currentTime);
                slot.setEndTime(currentTime.plusMinutes(durationMinutes));
                slot.setStatus(SlotStatus.AVAILABLE);
                slots.add(slot);
            }

            currentTime = currentTime.plusMinutes(durationMinutes);
        }

        return slots;
    }

    @Cacheable(value = "timeSlots", key = "#doctorId + '-' + #date")
    public Response getAvailableSlots(Long doctorId, LocalDate date) {
        Response response = new Response();
        try {
            List<TimeSlot> slots = timeSlotRepository.findByDoctorIdAndSlotDateAndStatus(
                    doctorId, date, SlotStatus.AVAILABLE);
            
            List<TimeSlotDTO> slotDTOs = slots.stream()
                    .map(this::mapToDTO)
                    .collect(Collectors.toList());

            response.setStatusCode(200);
            response.setMessage("Available slots fetched successfully");
            response.setTimeSlotList(slotDTOs);

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error fetching slots: " + e.getMessage());
        }
        return response;
    }

    @Transactional
    public TimeSlot bookSlot(Long slotId) throws OurException {
        TimeSlot slot = timeSlotRepository.findByIdWithLock(slotId)
                .orElseThrow(() -> new OurException("Time slot not found"));

        if (slot.getStatus() != SlotStatus.AVAILABLE) {
            throw new OurException("Time slot is not available");
        }

        slot.setStatus(SlotStatus.BOOKED);
        return timeSlotRepository.save(slot);
    }

    @Transactional
    public void releaseSlot(Long slotId) {
        timeSlotRepository.findById(slotId).ifPresent(slot -> {
            slot.setStatus(SlotStatus.AVAILABLE);
            slot.setAppointment(null);
            timeSlotRepository.save(slot);
        });
    }

    private TimeSlotDTO mapToDTO(TimeSlot slot) {
        TimeSlotDTO dto = new TimeSlotDTO();
        dto.setId(slot.getId());
        dto.setDoctorId(slot.getDoctor().getId());
        dto.setDoctorName(slot.getDoctor().getUser().getName());
        dto.setSlotDate(slot.getSlotDate());
        dto.setStartTime(slot.getStartTime());
        dto.setEndTime(slot.getEndTime());
        dto.setStatus(slot.getStatus());
        if (slot.getAppointment() != null) {
            dto.setAppointmentId(slot.getAppointment().getId());
        }
        return dto;
    }
}
