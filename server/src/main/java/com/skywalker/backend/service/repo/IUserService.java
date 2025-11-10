package com.skywalker.backend.service.repo;

import com.skywalker.backend.dto.PasswordChangeRequest;
import com.skywalker.backend.dto.Response;
import com.skywalker.backend.model.User;

public interface IUserService {

    Response getUserById(Long id);
    Response getAllUsers();
    Response deleteUser(Long id);

    // Self-service
    Response getCurrentUser();
    Response updateCurrentUser(User updatedUser);
    Response changePassword(PasswordChangeRequest request);

    Response getUsersByRole(String role);
    Response updateUser(Long id, User updatedUser);
}
