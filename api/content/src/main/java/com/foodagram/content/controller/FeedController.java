package com.foodagram.content.controller;

import com.foodagram.clients.content.dto.PostResponseDto;
import com.foodagram.clients.users.dto.UsersDto;
import com.foodagram.content.service.FeedService;
import com.foodagram.content.util.UsersUtil;
import jakarta.ws.rs.core.HttpHeaders;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST endpoint that exposes the caller’s personalised follow‑feed.
 * <p>
 * Example: <pre>{@code
 *   GET /api/v1/feed
 *   Authorization: Bearer <jwt>
 * }</pre>
 */
@RestController
@RequestMapping("/api/v1/content")
@RequiredArgsConstructor
@Slf4j
public class FeedController {

    private final FeedService feedService;
    private final UsersUtil usersUtil;

    @GetMapping("/feed")
    public ResponseEntity<List<PostResponseDto>> getFeed(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken,
            @RequestParam(defaultValue = "1") int page,    // Default to page 1
            @RequestParam(defaultValue = "10") int limit)  // Default to limit 10
    {
        try {
            UsersDto user = usersUtil.throwIfJwtTokenIsInvalidElseReturnUser(jwtToken);
            return ResponseEntity.ok(feedService.getFeed(user.getId(), page, limit));  // Pass page and limit to service
        } catch (Exception e) {
            log.error("Error while fetching feed: {}", e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

