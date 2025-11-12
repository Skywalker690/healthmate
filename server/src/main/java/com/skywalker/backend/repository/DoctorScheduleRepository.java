package com.skywalker.backend.repository;

import com.skywalker.backend.model.DoctorSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.util.List;

@Repository
public interface DoctorScheduleRepository extends JpaRepository<DoctorSchedule, Long> {
    
    List<DoctorSchedule> findByDoctorIdAndIsActiveTrue(Long doctorId);
    
    List<DoctorSchedule> findByDoctorIdAndDayOfWeekAndIsActiveTrue(Long doctorId, DayOfWeek dayOfWeek);
    
    void deleteByDoctorId(Long doctorId);
}
