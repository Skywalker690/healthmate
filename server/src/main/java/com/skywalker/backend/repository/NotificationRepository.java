package com.skywalker.backend.repository;

import com.skywalker.backend.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    List<Notification> findByUserIdOrderByTimestampDesc(Long userId);
    
    List<Notification> findByUserIdAndIsReadFalseOrderByTimestampDesc(Long userId);
    
    Long countByUserIdAndIsReadFalse(Long userId);
}
