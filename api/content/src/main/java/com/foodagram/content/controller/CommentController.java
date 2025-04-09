package com.foodagram.content.controller;

import com.foodagram.clients.content.dto.CommentCreateDto;
import com.foodagram.clients.content.dto.CommentEditDto;
import com.foodagram.clients.content.dto.CommentResponseDto;
import com.foodagram.clients.users.dto.UsersDto;
import com.foodagram.content.service.CommentService;
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
@RequestMapping("/api/v1/comments")
@RequiredArgsConstructor
@Slf4j
public class CommentController {
    private final CommentService commentService;
    private final UsersUtil usersUtil;

    @PostMapping
    public ResponseEntity<CommentResponseDto> createComment(@RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken, @RequestBody CommentCreateDto commentCreateDto) {
        try {
            UsersDto user = usersUtil.throwIfJwtTokenIsInvalidElseReturnUser(jwtToken);
            commentCreateDto.setUserId(user.getId());
            return ResponseEntity.ok(commentService.createComment(commentCreateDto));
        } catch (Exception e) {
            log.error("Error while creating comment: {}", e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommentResponseDto> getComment(@PathVariable UUID id) {
        try {
            return ResponseEntity.ok(commentService.getCommentById(id));
        } catch (Exception e) {
            log.error("Error while getting comment: {}", e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<CommentResponseDto>> getCommentsByPost(@PathVariable UUID postId) {
        try {
            return ResponseEntity.ok(commentService.getCommentsByPost(postId));
        } catch (Exception e) {
            log.error("Error while getting comments by post: {}", e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<CommentResponseDto> updateComment(@RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken, @PathVariable UUID id, @RequestBody CommentEditDto commentEditDto) {
        try {
            UsersDto user = usersUtil.throwIfJwtTokenIsInvalidElseReturnUser(jwtToken);
            usersUtil.throwIfJwtTokenIsInvalidElseReturnUser(jwtToken);
            return ResponseEntity.ok(commentService.updateComment(id, commentEditDto, user));
        } catch (Exception e) {
            log.error("Error while updating comment: {}", e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken, @PathVariable UUID id) {
        try {
            UsersDto user = usersUtil.throwIfJwtTokenIsInvalidElseReturnUser(jwtToken);
            commentService.deleteComment(id, user);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("Error while deleting comment: {}", e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
