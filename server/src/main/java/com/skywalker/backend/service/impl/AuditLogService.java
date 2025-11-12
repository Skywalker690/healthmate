package com.skywalker.backend.service.impl;

import com.skywalker.backend.model.AuditLog;
import com.skywalker.backend.model.User;
import com.skywalker.backend.repository.AuditLogRepository;
import com.skywalker.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    @Transactional
    public void logAction(Long userId, String action, String details) {
        try {
            User user = userRepository.findById(userId).orElse(null);
            
            AuditLog log = new AuditLog();
            log.setUser(user);
            log.setAction(action);
            log.setDetails(details);
            auditLogRepository.save(log);
        } catch (Exception e) {
            // Log silently, don't fail the main operation
            System.err.println("Failed to create audit log: " + e.getMessage());
        }
    }

    @Transactional
    public void logAction(String action, String details) {
        try {
            AuditLog log = new AuditLog();
            log.setAction(action);
            log.setDetails(details);
            auditLogRepository.save(log);
        } catch (Exception e) {
            // Log silently, don't fail the main operation
            System.err.println("Failed to create audit log: " + e.getMessage());
        }
    }
}
