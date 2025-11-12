package com.skywalker.backend.repository;

import com.skywalker.backend.model.Doctor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorRepository  extends JpaRepository<Doctor,Long> {

    void deleteByUserId(Long userId);

    List<Doctor> findBySpecialization(String specialization);

    Page<Doctor> findBySpecialization(String specialization, Pageable pageable);

    @Query("SELECT d FROM Doctor d WHERE LOWER(d.user.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    Page<Doctor> searchByName(@Param("name") String name, Pageable pageable);

    @Query("SELECT d FROM Doctor d WHERE LOWER(d.user.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(d.specialization) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Doctor> searchDoctors(@Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT d FROM Doctor d WHERE LOWER(d.specialization) = LOWER(:specialty)")
    Page<Doctor> findBySpecialtyExact(@Param("specialty") String specialty, Pageable pageable);
    
    @Query("SELECT DISTINCT d.specialization FROM Doctor d WHERE d.specialization IS NOT NULL ORDER BY d.specialization")
    List<String> findAllSpecializations();
}
