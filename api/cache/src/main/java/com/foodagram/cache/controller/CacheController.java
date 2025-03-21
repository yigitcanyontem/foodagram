package com.foodagram.cache.controller;

import com.foodagram.clients.users.dto.UsersDto;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.foodagram.cache.service.CacheService;

@RestController
@RequestMapping("api/v1/cache")
@AllArgsConstructor
@Slf4j
public class CacheController {
    private final CacheService cacheService;

    @GetMapping("/users/{email}")
    public ResponseEntity<UsersDto> getUserByEmail(@PathVariable("email") String email) {
        return ResponseEntity.ok(cacheService.getUserByEmail(email));
    }

    @PostMapping("/users")
    public ResponseEntity<Void> saveOrUpdateUser(@RequestBody UsersDto user){
        cacheService.saveOrUpdateUser(user);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/users/{email}")
    public ResponseEntity<Void> deleteUserByEmail(@PathVariable("email") String email) {
        cacheService.deleteUserByEmail(email);
        return ResponseEntity.noContent().build();
    }
}
