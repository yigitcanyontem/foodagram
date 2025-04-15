package com.foodagram.clients;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@EnableFeignClients(
        basePackageClasses = {

        }
)
@SpringBootApplication
public class ApigwApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApigwApplication.class, args);
    }

}
