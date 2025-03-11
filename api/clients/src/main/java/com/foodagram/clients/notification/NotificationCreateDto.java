package com.foodagram.clients.notification;

public record NotificationCreateDto(
        Integer userId,
        String message
) {
}
