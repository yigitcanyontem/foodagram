package com.foodagram.clients.notification;

import com.foodagram.clients.notification.dto.NotificationStatus;
import com.foodagram.clients.notification.dto.NotificationType;
import lombok.*;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationCreateDto {
    private UUID userId;
    private String title;
    private String content;
    private NotificationType notificationType;
    private String targetUrl;
    private UUID senderId;
}
