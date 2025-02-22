package com.foodagram.clients.auth;

import com.foodagram.clients.users.dto.UsersDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "auth")
public interface AuthClient {
    @PostMapping("api/v1/auth/validate-token")
    ResponseEntity<UsersDto> validateToken(@RequestParam("token") String token);
}
