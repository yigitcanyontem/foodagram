package com.foodagram.notification.domain;

import com.foodagram.clients.notification.dto.NotificationStatus;
import com.foodagram.clients.notification.dto.NotificationType;
import com.foodagram.clients.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@Entity
@Table(name = "notification")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class Notification extends BaseEntity {
    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "notification_status", nullable = false)
    @Enumerated(EnumType.STRING)
    private NotificationStatus notificationStatus;

    @Column(name = "notification_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private NotificationType notificationType;

    @Column(name = "target_url")
    private String targetUrl;

    @Column(name = "sender_id")
    private UUID senderId;
}
