package com.foodagram.clients;

import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ApiGwConfig {
    @Bean
    public GlobalFilter customFilter() {
        return new ApiGwGlobalFilter();
    }
}
