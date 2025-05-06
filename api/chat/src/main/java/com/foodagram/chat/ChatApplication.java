package com.foodagram.chat;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
@EnableFeignClients(
        basePackageClasses = {
                com.foodagram.clients.users.UsersClient.class,
                com.foodagram.clients.notification.NotificationClient.class,
                com.foodagram.clients.auth.AuthClient.class,
                com.foodagram.clients.cache.CacheClient.class,
                com.foodagram.clients.files.FilesClient.class,
                com.foodagram.clients.content.ContentClient.class,
                com.foodagram.clients.notification.NotificationClient.class
        }
)
@SpringBootApplication(scanBasePackages = {
        "com.foodagram.chat",
        "com.foodagram.amqp"
})
public class ChatApplication {

    public static void main(String[] args) {
        SpringApplication.run(ChatApplication.class, args);
    }

}
