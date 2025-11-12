package com.skywalker.backend.service.repo;

import com.skywalker.backend.dto.Response;
import com.skywalker.backend.model.User;


public interface IPatientService {

    Response getAllPatients();
    
    Response getAllPatientsPaginated(String search, int page, int size);

    Response getPatientById(Long id);

    Response updatePatient(Long patientId, User request);

    Response deletePatient(Long id);

}
