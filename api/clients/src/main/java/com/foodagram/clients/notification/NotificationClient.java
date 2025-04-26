package com.foodagram.clients.notification;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@FeignClient(
        name = "notification"
)
public interface NotificationClient {
    @GetMapping(path = "api/v1/notification/{notificationId}")
    NotificationDto getNotification(@RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken, @PathVariable("notificationId") UUID notificationId);

    @GetMapping(path = "api/v1/notification/mine")
    List<NotificationDto> getMyNotifications(@RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken);
}
