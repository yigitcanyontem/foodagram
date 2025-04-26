package com.foodagram.notification.controller;

import com.foodagram.clients.content.dto.CommentCreateDto;
import com.foodagram.clients.notification.NotificationDto;
import com.foodagram.clients.notification.dto.NotificationStatus;
import com.foodagram.clients.shared.dto.GenericResponse;
import com.foodagram.clients.users.dto.UsersDto;
import com.foodagram.notification.service.NotificationService;
import jakarta.ws.rs.core.HttpHeaders;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/notification")
@RequiredArgsConstructor
@Slf4j
public class NotificationController {
    private final NotificationService notificationService;
    private final com.foodagram.notification.util.UsersUtil usersUtil;

    @GetMapping("/{notificationId}")
    public ResponseEntity<NotificationDto> getNotification(@RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken, @PathVariable("notificationId") UUID notificationId) {
        try {
            UsersDto user = usersUtil.throwIfJwtTokenIsInvalidElseReturnUser(jwtToken);
            return ResponseEntity.ok(notificationService.getNotification(notificationId, user));
        } catch (Exception e) {
            log.error("Error while getting notificatios: {}", e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

//    @PutMapping("/{notificationIds}")
//    public ResponseEntity<Void> setNotificationAsRead(@RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken, @PathVariable("notificationId") List<UUID> notificationIds) {
//        try {
//            UsersDto user = usersUtil.throwIfJwtTokenIsInvalidElseReturnUser(jwtToken);
//            notificationService.setNotificationAsRead(notificationIds, user);
//            return ResponseEntity.ok().build();
//        } catch (Exception e) {
//            log.error("Error while setting notification as read: {}", e.getMessage());
//            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }


    @GetMapping("/mine")
    public ResponseEntity<List<NotificationDto>> getMyNotifications(@RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken) {
        try {
            UsersDto user = usersUtil.throwIfJwtTokenIsInvalidElseReturnUser(jwtToken);
            return ResponseEntity.ok(notificationService.getNotificationsByUserId(user.getId()));
        } catch (Exception e) {
            log.error("Error while getting users notificatios: {}", e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/unread")
    public ResponseEntity<GenericResponse> getUnreadNotificationCountByUserId(@RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken) {
        try {
            UsersDto user = usersUtil.throwIfJwtTokenIsInvalidElseReturnUser(jwtToken);
            return ResponseEntity.ok(notificationService.getUnreadNotificationCountByUserId(user.getId()));
        } catch (Exception e) {
            log.error("Error while getting unread notification count: {}", e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
