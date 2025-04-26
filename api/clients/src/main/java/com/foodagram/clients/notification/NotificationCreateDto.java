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
    private Boolean forAdmins;
    private UUID userId;
    private String title;
    private String content;
    private NotificationType notificationType;
    private String targetUrl;
    private UUID senderId;

    public NotificationCreateDto(UUID userId, String title, String content, NotificationType notificationType, String targetUrl, UUID senderId) {
        this.userId = userId;
        this.title = title;
        this.content = content;
        this.notificationType = notificationType;
        this.targetUrl = targetUrl;
        this.senderId = senderId;
    }

    public NotificationCreateDto(Boolean forAdmins, String title, String content, NotificationType notificationType) {
        this.forAdmins = forAdmins;
        this.title = title;
        this.content = content;
        this.notificationType = notificationType;
    }
}
