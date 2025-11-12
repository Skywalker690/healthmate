package com.skywalker.backend.controller;

import com.skywalker.backend.dto.PasswordChangeRequest;
import com.skywalker.backend.dto.Response;
import com.skywalker.backend.model.User;
import com.skywalker.backend.service.impl.AuthService;
import com.skywalker.backend.service.impl.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final AuthService authService;

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Response> getAllUsers(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Response response = userService.getAllUsersPaginated(search, page, size);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Response> getUserById(@PathVariable Long id) {
        Response response = userService.getUserById(id);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/me/password")
    public ResponseEntity<Response> changePassword(@RequestBody PasswordChangeRequest request) {
        Response response = userService.changePassword(request);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/me")
    public ResponseEntity<Response> getCurrentUser() {
        Response response = userService.getCurrentUser();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/me")
    public ResponseEntity<Response> updateCurrentUser(@RequestBody User updatedUser) {
        Response response = userService.updateCurrentUser(updatedUser);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Response> deleteUser(@PathVariable Long id) {
        Response response = userService.deleteUser(id);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/role/{role}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Response> getUsersByRole(@PathVariable String role) {
        Response response = userService.getUsersByRole(role);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Response> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        Response response = userService.updateUser(id, updatedUser);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
