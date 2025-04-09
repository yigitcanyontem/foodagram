package com.foodagram.content.controller;

import com.foodagram.clients.content.dto.CommentVoteCreateDto;
import com.foodagram.clients.content.dto.CommentVoteResponseDto;
import com.foodagram.clients.users.dto.UsersDto;
import com.foodagram.content.service.CommentVoteService;
import com.foodagram.content.util.UsersUtil;
import jakarta.ws.rs.core.HttpHeaders;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/comment-votes")
@RequiredArgsConstructor
@Slf4j
public class CommentVoteController {
    private final CommentVoteService commentVoteService;
    private final UsersUtil usersUtil;

    @PostMapping
    public ResponseEntity<CommentVoteResponseDto> createCommentVote(@RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken, @RequestBody CommentVoteCreateDto commentVoteCreateDto) {
        try {
            UsersDto user = usersUtil.throwIfJwtTokenIsInvalidElseReturnUser(jwtToken);
            return ResponseEntity.ok(commentVoteService.createCommentVote(commentVoteCreateDto, user.getId()));
        } catch (Exception e) {
            log.error("Error while creating comment vote: {}", e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/post/{commentId}")
    public ResponseEntity<List<CommentVoteResponseDto>> getCommentVotesByPost(@PathVariable UUID commentId) {
        try {
            return ResponseEntity.ok(commentVoteService.getCommentVotesByComment(commentId));
        } catch (Exception e) {
            log.error("Error while getting comments by comment: {}", e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCommentVote(@RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken, @PathVariable UUID id) {
        try {
            UsersDto user = usersUtil.throwIfJwtTokenIsInvalidElseReturnUser(jwtToken);
            commentVoteService.deleteCommentVote(id, user);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("Error while creating comment: {}", e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
