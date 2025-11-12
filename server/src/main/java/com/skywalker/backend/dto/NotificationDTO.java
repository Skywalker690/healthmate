package com.skywalker.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class NotificationDTO {
    private Long id;
    private Long userId;
    private String message;
    private Boolean isRead;
    private LocalDateTime timestamp;
}
