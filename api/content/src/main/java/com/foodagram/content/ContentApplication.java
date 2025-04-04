package com.foodagram.content;

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
                com.foodagram.clients.content.ContentClient.class
        }
)
@SpringBootApplication(
        scanBasePackages = {
                "com.foodagram.content",
                "com.foodagram.amqp"
        }
)
public class ContentApplication {
    public static void main(String[] args) {
        SpringApplication.run(ContentApplication.class, args);
    }
} 
