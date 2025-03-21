package com.foodagram.clients.notification;

import java.util.UUID;

public record NotificationCreateDto(
        UUID userId,
        String message
) {
}
