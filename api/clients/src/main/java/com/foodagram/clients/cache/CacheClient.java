package com.foodagram.clients.cache;

import com.foodagram.clients.users.dto.UsersDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "cache")
public interface CacheClient {
    @GetMapping("api/v1/cache/users/{email}")
    ResponseEntity<UsersDto> getUserByEmail(@PathVariable("email") String email);

    @PostMapping("api/v1/cache/users")
    ResponseEntity<UsersDto> saveOrUpdateUser(@RequestBody UsersDto user);

    @DeleteMapping("api/v1/cache/users/{email}")
    ResponseEntity<Void> deleteUserByEmail(@PathVariable("email") Integer id);

}


