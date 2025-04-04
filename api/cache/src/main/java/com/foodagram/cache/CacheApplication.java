package com.foodagram.cache;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
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
                "com.foodagram.cache",
                "com.foodagram.amqp"
        }
)
@EnableCaching
public class CacheApplication {

    public static void main(String[] args) {
        SpringApplication.run(CacheApplication.class, args);
    }

}
