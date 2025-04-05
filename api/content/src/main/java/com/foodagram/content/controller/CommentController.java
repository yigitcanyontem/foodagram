package com.foodagram.content.controller;

import com.foodagram.clients.content.dto.CommentCreateDto;
import com.foodagram.clients.content.dto.CommentEditDto;
import com.foodagram.clients.content.dto.CommentResponseDto;
import com.foodagram.clients.content.dto.CommentUpdateDto;
import com.foodagram.content.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/comments")
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;
//
//    @PostMapping
//    public ResponseEntity<CommentResponseDto> createComment(@RequestBody CommentCreateDto commentCreateDto) {
//        return ResponseEntity.ok(commentService.createComment(commentCreateDto));
//    }
//
//    @GetMapping("/{id}")
//    public ResponseEntity<CommentResponseDto> getComment(@PathVariable UUID id) {
//        return ResponseEntity.ok(commentService.getComment(id));
//    }
//
//    @GetMapping("/post/{postId}")
//    public ResponseEntity<List<CommentResponseDto>> getCommentsByPostId(@PathVariable UUID postId) {
//        return ResponseEntity.ok(commentService.getCommentsByPostId(postId));
//    }
//
//    @PutMapping("/{id}")
//    public ResponseEntity<CommentResponseDto> updateComment(@PathVariable UUID id, @RequestBody CommentUpdateDto commentUpdateDto) {
//        return ResponseEntity.ok(commentService.updateComment(id, commentUpdateDto));
//    }
//
//    @PatchMapping("/{id}")
//    public ResponseEntity<CommentResponseDto> editComment(@PathVariable UUID id, @RequestBody CommentEditDto commentEditDto) {
//        return ResponseEntity.ok(commentService.editComment(id, commentEditDto));
//    }
//
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteComment(@PathVariable UUID id) {
//        commentService.deleteComment(id);
//        return ResponseEntity.ok().build();
//    }
}
