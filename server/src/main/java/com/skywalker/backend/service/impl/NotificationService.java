package com.skywalker.backend.service.impl;

import com.skywalker.backend.dto.NotificationDTO;
import com.skywalker.backend.model.Notification;
import com.skywalker.backend.model.User;
import com.skywalker.backend.repository.NotificationRepository;
import com.skywalker.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public void sendNotification(Long userId, String message) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return;
        }

        // Save notification
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(message);
        notification.setIsRead(false);
        notificationRepository.save(notification);

        // Send real-time notification via WebSocket
        NotificationDTO dto = mapToDTO(notification);
        messagingTemplate.convertAndSendToUser(
            user.getEmail(), 
            "/queue/notifications", 
            dto
        );
    }

    public List<NotificationDTO> getUserNotifications(Long userId) {
        List<Notification> notifications = notificationRepository.findByUserIdOrderByTimestampDesc(userId);
        return notifications.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<NotificationDTO> getUnreadNotifications(Long userId) {
        List<Notification> notifications = notificationRepository.findByUserIdAndIsReadFalseOrderByTimestampDesc(userId);
        return notifications.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(notification -> {
            notification.setIsRead(true);
            notificationRepository.save(notification);
        });
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> notifications = notificationRepository.findByUserIdAndIsReadFalseOrderByTimestampDesc(userId);
        notifications.forEach(notification -> notification.setIsRead(true));
        notificationRepository.saveAll(notifications);
    }

    public Long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    private NotificationDTO mapToDTO(Notification notification) {
        NotificationDTO dto = new NotificationDTO();
        dto.setId(notification.getId());
        dto.setUserId(notification.getUser().getId());
        dto.setMessage(notification.getMessage());
        dto.setIsRead(notification.getIsRead());
        dto.setTimestamp(notification.getTimestamp());
        return dto;
    }
}
