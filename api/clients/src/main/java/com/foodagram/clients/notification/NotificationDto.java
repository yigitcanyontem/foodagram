package com.foodagram.clients.notification;

import com.foodagram.clients.notification.dto.NotificationStatus;
import com.foodagram.clients.notification.dto.NotificationType;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationDto {
    private UUID id;
    private UUID userId;
    private String title;
    private String content;
    private NotificationStatus notificationStatus;
    private NotificationType notificationType;
    private String targetUrl;
    private UUID senderId;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
    private String mediaUrl;
    private Boolean forAdmins;
}
