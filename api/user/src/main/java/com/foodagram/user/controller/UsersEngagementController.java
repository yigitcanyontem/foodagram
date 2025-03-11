package com.foodagram.user.controller;

import jakarta.ws.rs.core.HttpHeaders;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.foodagram.clients.users.dto.UsersDto;
import com.foodagram.user.service.UsersEngagementService;
import com.foodagram.user.util.UsersUtil;

@Slf4j
@RestController
@RequestMapping("api/v1/user-engagement")
@RequiredArgsConstructor
public class UsersEngagementController {
    private final UsersEngagementService usersEngagementService;
    private final UsersUtil usersUtil;

    @PutMapping("/follow/{engagedUserId}")
    public ResponseEntity<Void> followUser(@RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken, @PathVariable("engagedUserId") Integer engagedUserId) {
        try {
            UsersDto user = usersUtil.throwIfJwtTokenIsInvalidElseReturnUser(jwtToken);

            if (user.getId().equals(engagedUserId)) {
                return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
            }

            usersEngagementService.followUser(user.getId(), engagedUserId);
            return ResponseEntity.ok().build();
        }catch (Exception e) {
            log.error("Error while saving user profile: {}", e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/unfollow/{engagedUserId}")
    public ResponseEntity<Void> unfollowUser(@RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken, @PathVariable("engagedUserId") Integer engagedUserId) {
        try {
            UsersDto user = usersUtil.throwIfJwtTokenIsInvalidElseReturnUser(jwtToken);

            if (user.getId().equals(engagedUserId)) {
                return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
            }

            usersEngagementService.unfollowUser(user.getId(), engagedUserId);
            return ResponseEntity.ok().build();
        }catch (Exception e) {
            log.error("Error while updating user profile: {}", e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

}
