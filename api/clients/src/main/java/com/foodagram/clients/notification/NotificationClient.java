package com.foodagram.clients.notification;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(
        name = "notification"
)
public interface NotificationClient {
    @GetMapping(path = "api/v1/notification/{notificationId}")
    NotificationDto getNotification(@PathVariable("notificationId") Integer notificationId);

    @PostMapping("api/v1/notification")
    NotificationDto sendNotification(@RequestBody NotificationCreateDto notificationCreateDto);

}
