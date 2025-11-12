package com.skywalker.backend.repository;

import com.skywalker.backend.model.Patient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PatientRepository  extends JpaRepository<Patient,Long> {

    void deleteByUserId(Long userId);
    
    @Query("SELECT p FROM Patient p WHERE LOWER(p.user.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(p.user.email) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Patient> searchPatients(@Param("keyword") String keyword, Pageable pageable);
}
