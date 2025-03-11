package com.foodagram.clients.notification;


import java.util.Date;

public record NotificationDto(
        String message,
        boolean isRead,
        Date createdAt
) {
}
