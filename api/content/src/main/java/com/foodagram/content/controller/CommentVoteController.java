package com.foodagram.content.controller;

import com.foodagram.clients.content.dto.CommentVoteCreateDto;
import com.foodagram.clients.content.dto.CommentVoteResponseDto;
import com.foodagram.content.service.CommentVoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/comment-votes")
@RequiredArgsConstructor
public class CommentVoteController {
    private final CommentVoteService commentVoteService;
//
//    @PostMapping
//    public ResponseEntity<CommentVoteResponseDto> createCommentVote(@RequestBody CommentVoteCreateDto commentVoteCreateDto) {
//        return ResponseEntity.ok(commentVoteService.createCommentVote(commentVoteCreateDto));
//    }
//
//    @GetMapping("/{id}")
//    public ResponseEntity<CommentVoteResponseDto> getCommentVote(@PathVariable UUID id) {
//        return ResponseEntity.ok(commentVoteService.getCommentVote(id));
//    }
//
//    @GetMapping("/comment/{commentId}")
//    public ResponseEntity<List<CommentVoteResponseDto>> getCommentVotesByCommentId(@PathVariable UUID commentId) {
//        return ResponseEntity.ok(commentVoteService.getCommentVotesByCommentId(commentId));
//    }
//
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteCommentVote(@PathVariable UUID id) {
//        commentVoteService.deleteCommentVote(id);
//        return ResponseEntity.ok().build();
//    }
} 
