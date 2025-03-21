package com.foodagram.clients.files;

import com.foodagram.clients.notification.NotificationCreateDto;
import com.foodagram.clients.notification.NotificationDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(
        name = "files"
)
public interface FilesClient {

}
