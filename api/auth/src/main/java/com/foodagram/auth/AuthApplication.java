package com.foodagram.auth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@EnableFeignClients(
        basePackageClasses = {
                com.foodagram.clients.users.UsersClient.class,
                com.foodagram.clients.notification.NotificationClient.class,
                com.foodagram.clients.auth.AuthClient.class,
                com.foodagram.clients.cache.CacheClient.class,
                com.foodagram.clients.files.FilesClient.class
        }
)
@SpringBootApplication(
        scanBasePackages = {
                "com.foodagram.auth",
                "com.foodagram.amqp"
        }
)
public class AuthApplication {

    public static void main(String[] args) {
        SpringApplication.run(AuthApplication.class, args);
    }

}
