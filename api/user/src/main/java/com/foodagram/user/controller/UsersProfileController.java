package com.foodagram.user.controller;

import jakarta.ws.rs.core.HttpHeaders;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.foodagram.clients.users.dto.UsersDto;
import com.foodagram.clients.users.profile.UsersProfileCreateDto;
import com.foodagram.clients.users.profile.UsersProfileDto;
import com.foodagram.clients.users.profile.UsersProfileUpdateDto;
import com.foodagram.user.service.UsersProfileService;
import com.foodagram.user.util.UsersUtil;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("api/v1/user-profile")
@RequiredArgsConstructor
public class UsersProfileController {
    private final UsersProfileService usersProfileService;
    private final UsersUtil usersUtil;

    @GetMapping("current")
    public ResponseEntity<UsersProfileDto> getLoggedInUserProfile(@RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken) {
        try {
            UsersDto user = usersUtil.throwIfJwtTokenIsInvalidElseReturnUser(jwtToken);

            return new ResponseEntity<>(usersProfileService.getUsersProfileByUsersId(user.getId()), HttpStatus.OK);
        }catch (Exception e) {
            log.error("Error while fetching user from token: {}", e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("user/{userId}")
    public ResponseEntity<UsersProfileDto> getUserProfileByUserId(@PathVariable("userId") UUID userId) {
        try {
            return new ResponseEntity<>(usersProfileService.
                    getUsersProfileByUsersId(userId), HttpStatus.OK);
        }catch (Exception e) {
            log.error("Error while fetching user profile by user id: {}", e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("email/{email}")
    public ResponseEntity<UsersProfileDto> getUserProfileByEmail(@PathVariable("email") String email) {
        try {
            return new ResponseEntity<>(usersProfileService.getUsersProfileByEmail(email), HttpStatus.OK);
        }catch (Exception e) {
            log.error("Error while fetching user profile by email: {}", e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("search/{query}")
    public ResponseEntity<List<UsersProfileDto>> searchUserProfiles(@PathVariable("query") String query) {
        try {
            return new ResponseEntity<>(usersProfileService.searchUserProfiles(query), HttpStatus.OK);
        }catch (Exception e) {
            log.error("Error while fetching user profile by email: {}", e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping()
    public ResponseEntity<UsersProfileDto> save(@RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken, @RequestBody UsersProfileCreateDto createDto) {
        try {
            UsersDto user = usersUtil.throwIfJwtTokenIsInvalidElseReturnUser(jwtToken);

            return new ResponseEntity<>(usersProfileService.save(createDto, user), HttpStatus.OK);
        }catch (Exception e) {
            log.error("Error while saving user profile: {}", e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping()
    public ResponseEntity<UsersProfileDto> update(@RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken, @RequestBody UsersProfileUpdateDto updateDto) {
        try {
            UsersDto user = usersUtil.throwIfJwtTokenIsInvalidElseReturnUser(jwtToken);

            return new ResponseEntity<>(usersProfileService.update(updateDto, user), HttpStatus.OK);
        }catch (Exception e) {
            log.error("Error while updating user profile: {}", e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping()
    public ResponseEntity<Void> delete(@RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken) {
        try {
            UsersDto user = usersUtil.throwIfJwtTokenIsInvalidElseReturnUser(jwtToken);
            usersProfileService.delete(user);
            return ResponseEntity.ok().build();
        }catch (Exception e) {
            log.error("Error while deleting user profile: {}", e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/upload-profile-picture")
    public ResponseEntity<Void> uploadProfilePicture(
            @RequestParam("file") MultipartFile file,
            @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken
    ) {
        try {
            UsersDto user = usersUtil.throwIfJwtTokenIsInvalidElseReturnUser(jwtToken);
            usersProfileService.uploadProfilePicture(file,user);
            return ResponseEntity.ok().build();
        }catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

}
