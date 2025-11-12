package com.skywalker.backend.service.impl;

import com.skywalker.backend.dto.DoctorDTO;
import com.skywalker.backend.dto.Response;
import com.skywalker.backend.exception.OurException;
import com.skywalker.backend.model.Doctor;
import com.skywalker.backend.model.User;
import com.skywalker.backend.repository.DoctorRepository;
import com.skywalker.backend.repository.UserRepository;
import com.skywalker.backend.security.Utils;
import com.skywalker.backend.service.repo.IDoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DoctorService implements IDoctorService {

    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;

    @Override
    @org.springframework.cache.annotation.Cacheable(value = "doctors", key = "'all'")
    public Response getAllDoctors() {
        Response response = new Response();
        try {
            List<Doctor> patients = doctorRepository.findAll();
            response.setDoctorList(Utils.mapDoctorListToDTOList(patients));
            response.setStatusCode(200);
            response.setMessage("Doctor fetched successfully");
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred while fetching doctor: " + e.getMessage());
        }
        return response;
    }

    public Response getAllDoctorsPaginated(String search, String specialty, Pageable pageable) {
        Response response = new Response();
        try {
            Page<Doctor> doctorPage;
            
            // Priority: specialty filter > general search > all
            if (specialty != null && !specialty.trim().isEmpty()) {
                // Exact specialty match
                doctorPage = doctorRepository.findBySpecialtyExact(specialty, pageable);
            } else if (search != null && !search.trim().isEmpty()) {
                // Search by name or specialization
                doctorPage = doctorRepository.searchDoctors(search, pageable);
            } else {
                // Get all doctors with pagination
                doctorPage = doctorRepository.findAll(pageable);
            }
            
            List<DoctorDTO> doctorDTOs = Utils.mapDoctorListToDTOList(doctorPage.getContent());
            
            // Prepare pagination metadata
            Map<String, Object> paginationData = new HashMap<>();
            paginationData.put("content", doctorDTOs);
            paginationData.put("currentPage", doctorPage.getNumber());
            paginationData.put("totalPages", doctorPage.getTotalPages());
            paginationData.put("totalElements", doctorPage.getTotalElements());
            paginationData.put("pageSize", doctorPage.getSize());
            paginationData.put("hasNext", doctorPage.hasNext());
            paginationData.put("hasPrevious", doctorPage.hasPrevious());
            
            response.setDoctorList(doctorDTOs);
            response.setData(paginationData);
            response.setStatusCode(200);
            response.setMessage("Doctors fetched successfully");
            
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred while fetching doctors: " + e.getMessage());
        }
        return response;
    }
    
    public Response getAllSpecializations() {
        Response response = new Response();
        try {
            List<String> specializations = doctorRepository.findAllSpecializations();
            
            Map<String, Object> data = new HashMap<>();
            data.put("specializations", specializations);
            
            response.setData(data);
            response.setStatusCode(200);
            response.setMessage("Specializations fetched successfully");
            
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred while fetching specializations: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getDoctorById(Long id) {
        Response response = new Response();
        try {
            Doctor doctor =doctorRepository.findById(id).orElseThrow(
                    () -> new OurException("Doctor not found with this ID")
            );
            response.setDoctor(Utils.mapDoctorToDTO(doctor));
            response.setStatusCode(200);
            response.setMessage("Doctor fetched successfully");
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred while fetching doctor: " + e.getMessage());
        }
        return response;
    }

    @Override
    @org.springframework.cache.annotation.Cacheable(value = "doctors", key = "'spec-' + #specialization")
    public Response getDoctorsBySpecialization(String specialization) {
        Response response = new Response();
        try {
            List<Doctor> doctors = doctorRepository.findBySpecialization(specialization);

            if (doctors.isEmpty()) {
                throw new OurException("No doctors found with specialization: " + specialization);
            }

            // Convert to DTO List
            List<DoctorDTO> doctorDTOs = Utils.mapDoctorListToDTOList(doctors);

            response.setDoctorList(doctorDTOs);
            response.setStatusCode(200);
            response.setMessage("Doctors fetched successfully");

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }

    @Override
    @org.springframework.cache.annotation.CacheEvict(value = "doctors", allEntries = true)
    public Response updateDoctor(Long doctorId, Doctor request) {
        Response response = new Response();
        try {
            // Fetch doctor and associated user
            Doctor doctor = doctorRepository.findById(doctorId)
                    .orElseThrow(() -> new OurException("Doctor not found"));
            User user = doctor.getUser();

            // Update Doctor-specific fields
            if (request.getSpecialization() != null) doctor.setSpecialization(request.getSpecialization());
            if (request.getExperience() != null) doctor.setExperience(request.getExperience());
            if (request.getAvailableHours() != null) doctor.setAvailableHours(request.getAvailableHours());

            doctorRepository.save(doctor);

            response.setStatusCode(200);
            response.setMessage("Doctor updated successfully");
            response.setDoctor(Utils.mapDoctorToDTO(doctor));

        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred while updating doctor: " + e.getMessage());
        }
        return response;
    }



    @Override
    public Response deleteDoctor(Long id) {
        Response response = new Response();
        try {
            Doctor doctor = doctorRepository.findById(id)
                    .orElseThrow(() -> new OurException("Doctor not found, deletion failed"));

            // Delete associated user and patient
            Long userId = doctor.getUser().getId();
            doctorRepository.deleteById(doctor.getId());
            userRepository.deleteById(userId);

            response.setStatusCode(200);
            response.setMessage("Doctor deleted successfully");

        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred while deleting doctor: " + e.getMessage());
        }
        return response;
    }
}
