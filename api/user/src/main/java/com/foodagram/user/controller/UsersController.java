package com.foodagram.user.controller;

import com.foodagram.clients.users.dto.UserRegisterDTO;
import com.foodagram.clients.users.dto.UsersCompleteDto;
import com.foodagram.clients.users.dto.UsersDto;
import com.foodagram.user.service.UsersService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("api/v1/user")
@RequiredArgsConstructor
public class UsersController {
    private final UsersService usersService;

    @GetMapping("me")
    public ResponseEntity<UsersCompleteDto> getLoggedInUser(@RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken) {
       try {
            return new ResponseEntity<>(usersService.getLoggedInUser(jwtToken), HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error while fetching logged in user: {}", e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
       }
    }

    @GetMapping("username/{username}")
    public ResponseEntity<UsersDto> getUsersByUsername(@PathVariable("username") String username) {
        try {
            return new ResponseEntity<>(usersService.getUsersByUsername(username), HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error while fetching user profile by username: {}", e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("id/{id}")
    public ResponseEntity<UsersDto> getUserById(@PathVariable("id") UUID id) {
        try {
            return new ResponseEntity<>(usersService.getUserById(id), HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error while fetching user profile by user id: {}", e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("email/{email}")
    public ResponseEntity<UsersDto> getUserByEmail(@PathVariable("email") String email) {
        try {
            return new ResponseEntity<>(usersService.getUserByEmail(email), HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error while fetching user profile by email: {}", e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping()
    public ResponseEntity<UsersDto> save(@RequestBody UsersDto user) {
        try {
            return new ResponseEntity<>(usersService.save(user), HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error while fetching user profile by user id: {}", e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("exists")
    public boolean userExists(@RequestBody UserRegisterDTO user) {
        return usersService.userExists(user);
    }

    @GetMapping("all")
    public ResponseEntity<List<UsersCompleteDto>> getAllUsers(){
        try {
            //TODO check if user is admin
            return new ResponseEntity<>(usersService.getAllUsers(), HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error while fetching all users: {}", e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteUser(
            @PathVariable("id") UUID id,
            @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken) {
        try {
            //TODO check if user is admin
            usersService.deleteUser(id, jwtToken);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            log.error("Error while deleting user: {}", e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
