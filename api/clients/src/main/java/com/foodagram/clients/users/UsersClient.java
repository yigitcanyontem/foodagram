package com.foodagram.clients.users;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.foodagram.clients.users.dto.UserRegisterDTO;
import com.foodagram.clients.users.dto.UsersDto;
import com.foodagram.clients.users.profile.UsersProfileCreateDto;
import com.foodagram.clients.users.profile.UsersProfileDto;
import com.foodagram.clients.users.profile.UsersProfileUpdateDto;

@FeignClient(name = "users")
public interface UsersClient {
    //User
    @GetMapping(path = "api/v1/user/username/{username}")
    ResponseEntity<UsersDto> getUsersByUsername(@PathVariable("username") String username);

    @GetMapping(path = "api/v1/user/email/{email}")
    ResponseEntity<UsersDto> getUserByEmail(@PathVariable("email") String email);

    @GetMapping(path = "api/v1/user/id/{id}")
    ResponseEntity<UsersDto> getUserById(@PathVariable("id") Integer id);

    @PostMapping(path = "api/v1/user")
    ResponseEntity<UsersDto> save(@RequestBody UsersDto user);

    @PostMapping(path = "api/v1/user/exists")
    boolean userExists(UserRegisterDTO request);

    //Profile
    @GetMapping("api/v1/user-profile/current")
    ResponseEntity<UsersProfileDto> getLoggedInUserProfile(@RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken);

    @GetMapping(path = "api/v1/user-profile/user/{userId}")
    UsersProfileDto getUserProfileByUserId(@PathVariable("userId") Integer userId);

    @GetMapping(path = "api/v1/user-profile/email/{email}")
    UsersProfileDto getUserProfileByEmail(@PathVariable("email") String email);

    @PostMapping(path = "api/v1/user/profile")
    UsersProfileDto saveUserProfile(@RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken, @RequestBody UsersProfileCreateDto createDto);

    @PutMapping(path = "api/v1/user-profile")
    UsersProfileDto updateUserProfile(@RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken, @RequestBody UsersProfileUpdateDto updateDto);

    @DeleteMapping(path = "api/v1/user-profile")
    void deleteUserProfile(@RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken);
}
