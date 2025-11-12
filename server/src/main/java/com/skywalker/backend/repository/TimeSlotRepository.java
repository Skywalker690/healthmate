package com.skywalker.backend.repository;

import com.skywalker.backend.domain.SlotStatus;
import com.skywalker.backend.model.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.persistence.LockModeType;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {
    
    List<TimeSlot> findByDoctorIdAndSlotDateAndStatus(Long doctorId, LocalDate date, SlotStatus status);
    
    List<TimeSlot> findByDoctorIdAndSlotDateBetweenAndStatus(
        Long doctorId, LocalDate startDate, LocalDate endDate, SlotStatus status);
    
    @Lock(LockModeType.OPTIMISTIC)
    @Query("SELECT t FROM TimeSlot t WHERE t.id = :id")
    Optional<TimeSlot> findByIdWithLock(@Param("id") Long id);
    
    Optional<TimeSlot> findByDoctorIdAndSlotDateAndStartTime(Long doctorId, LocalDate date, LocalTime startTime);
    
    List<TimeSlot> findByDoctorIdAndSlotDate(Long doctorId, LocalDate date);
    
    void deleteByDoctorIdAndSlotDateBetween(Long doctorId, LocalDate startDate, LocalDate endDate);
}
