package com.foodagram.notification.repository;

import com.foodagram.clients.notification.dto.NotificationStatus;
import com.foodagram.notification.domain.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {
    List<Notification> findByUserIdOrderByCreatedDateDesc(UUID userId);

    long countByUserIdAndNotificationStatus(UUID userId, NotificationStatus notificationStatus);

    List<Notification> findAllByIdIn(Collection<UUID> ids);
}
