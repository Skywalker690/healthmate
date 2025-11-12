package com.skywalker.backend.service.impl;

import com.skywalker.backend.dto.PatientDTO;
import com.skywalker.backend.dto.Response;
import com.skywalker.backend.exception.OurException;
import com.skywalker.backend.model.Patient;
import com.skywalker.backend.model.User;
import com.skywalker.backend.repository.PatientRepository;
import com.skywalker.backend.repository.UserRepository;
import com.skywalker.backend.security.Utils;
import com.skywalker.backend.service.repo.IPatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PatientService implements IPatientService {

    private final PatientRepository patientRepository;
    private final UserRepository userRepository;

    @Override
    public Response getAllPatients() {
        Response response = new Response();
        try {
            List<Patient> patients = patientRepository.findAll();
            response.setPatientList(Utils.mapPatientListToDTOList(patients));
            response.setStatusCode(200);
            response.setMessage("Patient fetched successfully");
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred while fetching patients: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getAllPatientsPaginated(String search, int page, int size) {
        Response response = new Response();
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Patient> patientPage;
            
            if (search != null && !search.trim().isEmpty()) {
                patientPage = patientRepository.searchPatients(search, pageable);
            } else {
                patientPage = patientRepository.findAll(pageable);
            }
            
            List<PatientDTO> patientDTOs = Utils.mapPatientListToDTOList(patientPage.getContent());
            
            // Prepare pagination metadata
            Map<String, Object> paginationData = new HashMap<>();
            paginationData.put("content", patientDTOs);
            paginationData.put("currentPage", patientPage.getNumber());
            paginationData.put("totalPages", patientPage.getTotalPages());
            paginationData.put("totalElements", patientPage.getTotalElements());
            paginationData.put("pageSize", patientPage.getSize());
            paginationData.put("hasNext", patientPage.hasNext());
            paginationData.put("hasPrevious", patientPage.hasPrevious());
            
            response.setPatientList(patientDTOs);
            response.setData(paginationData);
            response.setStatusCode(200);
            response.setMessage("Patients fetched successfully");
            
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred while fetching patients: " + e.getMessage());
        }
        return response;
    }


    @Override
    public Response getPatientById(Long id) {
        Response response = new Response();
        try {
            Patient patient =patientRepository.findById(id).orElseThrow(
                    () -> new OurException("Patient not found with this ID")
            );
            response.setPatient(Utils.mapPatientToDTO(patient));
            response.setStatusCode(200);
            response.setMessage("Patient fetched successfully");
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred while fetching patients: " + e.getMessage());
        }
        return response;

    }

    @Override
    public Response updatePatient(Long patientId, User request) {
        Response response = new Response();
        try {
            // Fetch patient and associated user
            Patient patient = patientRepository.findById(patientId)
                    .orElseThrow(() -> new OurException("Patient not found"));
            User user = patient.getUser();

            // Update User fields
            if (request.getName() != null) user.setName(request.getName());
            if (request.getPhoneNumber() != null) user.setPhoneNumber(request.getPhoneNumber());
            if (request.getAddress() != null) user.setAddress(request.getAddress());
            if (request.getDateOfBirth() != null) user.setDateOfBirth(request.getDateOfBirth());
            patientRepository.save(patient);

            response.setStatusCode(200);
            response.setMessage("Patient updated successfully");
            response.setPatient(Utils.mapPatientToDTO(patient));

        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred while updating patient: " + e.getMessage());
        }
        return response;
    }


    @Transactional
    @Override
    public Response deletePatient(Long id) {
        Response response = new Response();
        try {
            Patient patient = patientRepository.findById(id)
                    .orElseThrow(() -> new OurException("Patient not found, deletion failed"));


            // Delete associated user and patient
            Long userId = patient.getUser().getId();
            patientRepository.deleteById(patient.getId());
            userRepository.deleteById(userId);

            response.setStatusCode(200);
            response.setMessage("Patient deleted successfully");

        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred while deleting patient: " + e.getMessage());
        }
        return response;
    }

}
