package com.skywalker.backend.service;

import com.skywalker.backend.dto.DoctorScheduleDTO;
import com.skywalker.backend.dto.Response;
import com.skywalker.backend.model.Doctor;
import com.skywalker.backend.model.User;
import com.skywalker.backend.repository.DoctorRepository;
import com.skywalker.backend.repository.DoctorScheduleRepository;
import com.skywalker.backend.service.impl.DoctorScheduleService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DoctorScheduleServiceTest {

    @Mock
    private DoctorScheduleRepository scheduleRepository;

    @Mock
    private DoctorRepository doctorRepository;

    @InjectMocks
    private DoctorScheduleService scheduleService;

    private Doctor testDoctor;

    @BeforeEach
    void setUp() {
        User user = new User();
        user.setId(1L);
        user.setName("Dr. Test");

        testDoctor = new Doctor();
        testDoctor.setId(1L);
        testDoctor.setUser(user);
    }

    @Test
    void testAddOrUpdateSchedule_Success() {
        // Arrange
        DoctorScheduleDTO scheduleDTO = new DoctorScheduleDTO();
        scheduleDTO.setDayOfWeek(DayOfWeek.MONDAY);
        scheduleDTO.setStartTime(LocalTime.of(9, 0));
        scheduleDTO.setEndTime(LocalTime.of(17, 0));
        scheduleDTO.setIsActive(true);

        when(doctorRepository.findById(anyLong())).thenReturn(Optional.of(testDoctor));
        when(scheduleRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        Response response = scheduleService.addOrUpdateSchedule(1L, Arrays.asList(scheduleDTO));

        // Assert
        assertEquals(200, response.getStatusCode());
        assertEquals("Schedule updated successfully", response.getMessage());
        assertNotNull(response.getScheduleList());
        verify(scheduleRepository).deleteByDoctorId(1L);
        verify(scheduleRepository).saveAll(anyList());
    }

    @Test
    void testAddOrUpdateSchedule_DoctorNotFound() {
        // Arrange
        DoctorScheduleDTO scheduleDTO = new DoctorScheduleDTO();
        scheduleDTO.setDayOfWeek(DayOfWeek.MONDAY);
        scheduleDTO.setStartTime(LocalTime.of(9, 0));
        scheduleDTO.setEndTime(LocalTime.of(17, 0));

        when(doctorRepository.findById(anyLong())).thenReturn(Optional.empty());

        // Act
        Response response = scheduleService.addOrUpdateSchedule(1L, Arrays.asList(scheduleDTO));

        // Assert
        assertEquals(404, response.getStatusCode());
        assertTrue(response.getMessage().contains("not found"));
    }
}
