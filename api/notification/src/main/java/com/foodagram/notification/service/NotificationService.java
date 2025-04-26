package com.foodagram.notification.service;

import com.foodagram.clients.notification.NotificationCreateDto;
import com.foodagram.clients.notification.NotificationDto;
import com.foodagram.clients.notification.dto.NotificationStatus;
import com.foodagram.clients.notification.dto.NotificationType;
import com.foodagram.clients.shared.dto.GenericRabbitMQMessage;
import com.foodagram.clients.shared.dto.GenericResponse;
import com.foodagram.clients.users.UsersClient;
import com.foodagram.clients.users.dto.UsersDto;
import com.foodagram.notification.domain.Notification;
import com.foodagram.notification.rabbitmq.AMQPService;
import com.foodagram.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final UsersClient usersClient;
    private final AMQPService aMQPService;

    public void createNotification(NotificationCreateDto request) {
        Notification notification = Notification.builder()
                .forAdmins(request.getForAdmins())
                .userId(request.getUserId())
                .title(request.getTitle())
                .content(request.getContent())
                .notificationStatus(NotificationStatus.SENT)
                .notificationType(request.getNotificationType())
                .targetUrl(request.getTargetUrl())
                .senderId(request.getSenderId())
                .build();

        notificationRepository.save(notification);
    }

    public List<NotificationDto> getNotificationsByUserId(UUID userId) {
        List<NotificationDto> notificationDtos = notificationRepository.findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        aMQPService.publishToNotificationQueue(
                new GenericRabbitMQMessage(
                        "setNotificationAsRead",
                        notificationDtos.stream()
                                .filter(notification -> notification.getNotificationStatus() == NotificationStatus.SENT)
                                .map(NotificationDto::getId)
                                .collect(Collectors.toList())
                )
        );

        return notificationDtos;
    }

    public NotificationDto getNotification(UUID notificationId, UsersDto user) {
        NotificationDto notificationDto = notificationRepository.findById(notificationId)
                .map(this::mapToResponse)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        if (!notificationDto.getUserId().equals(user.getId())) {
            throw new RuntimeException("You are not allowed to see this notification");
        }
        return notificationDto;
    }

    public GenericResponse getUnreadNotificationCountByUserId(UUID userId) {
        long count = notificationRepository.countByUserIdAndNotificationStatus(userId, NotificationStatus.SENT);
        return new GenericResponse(
                "getUnreadNotificationCountByUserId",
                count,
                true
        );
    }


    private NotificationDto mapToResponse(Notification n) {
        return NotificationDto.builder()
                .id(n.getId())
                .userId(n.getUserId())
                .title(n.getTitle())
                .content(n.getContent())
                .notificationStatus(n.getNotificationStatus())
                .notificationType(n.getNotificationType())
                .targetUrl(n.getTargetUrl())
                .senderId(n.getSenderId())
                .createdDate(n.getCreatedDate())
                .updatedDate(n.getUpdatedDate())
                .mediaUrl(getMediaUrlForNotification(n))
                .forAdmins(n.getForAdmins())
                .build();
    }

    private String getMediaUrlForNotification(Notification notification) {
        try {
            return usersClient.getUserProfileByUserId(notification.getSenderId()).getProfilePicture();
        }catch (Exception e){
            log.error("Error while getting media url for notification: {}", e.getMessage());
            return null;
        }
    }

    public void setNotificationAsRead(List<UUID> notificationIds) {
        List<Notification> notifications = notificationRepository.findAllByIdIn(notificationIds);
        notifications.forEach(notification -> notification.setNotificationStatus(NotificationStatus.READ));
        notificationRepository.saveAll(notifications);
    }
}
