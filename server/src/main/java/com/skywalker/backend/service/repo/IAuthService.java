package com.skywalker.backend.service.repo;

import com.skywalker.backend.dto.LoginRequest;
import com.skywalker.backend.dto.RegisterRequest;
import com.skywalker.backend.dto.Response;

public interface IAuthService {

    Response login(LoginRequest loginRequest);
    Response register(RegisterRequest request);
}
