package com.foodagram.content.service;

import com.foodagram.content.domain.Comment;
import com.foodagram.clients.content.dto.CommentCreateDto;
import com.foodagram.clients.content.dto.CommentEditDto;
import com.foodagram.clients.content.dto.CommentResponseDto;
import com.foodagram.clients.content.dto.CommentUpdateDto;
import com.foodagram.content.repository.CommentRepository;
import com.foodagram.content.util.UsersUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final UsersUtil usersUtil;
//
//    @Transactional
//    public CommentResponseDto createComment(CommentCreateDto commentCreateDto) {
//        Comment comment = Comment.builder()
//                .postId(commentCreateDto.getPostId())
//                .postType(commentCreateDto.getPostType())
//                .userId(usersUtil.getCurrentUserId())
//                .content(commentCreateDto.getContent())
//                .createdByUsername(usersUtil.getCurrentUsername())
//                .parentReplyId(commentCreateDto.getParentReplyId())
//                .build();
//        return mapToResponseDto(commentRepository.save(comment));
//    }
//
//    public CommentResponseDto getComment(UUID id) {
//        return mapToResponseDto(findCommentById(id));
//    }
//
//    public List<CommentResponseDto> getCommentsByPostId(UUID postId) {
//        return commentRepository.findByPostId(postId).stream()
//                .map(this::mapToResponseDto)
//                .collect(Collectors.toList());
//    }
//
//    @Transactional
//    public CommentResponseDto updateComment(UUID id, CommentUpdateDto commentUpdateDto) {
//        Comment comment = findCommentById(id);
//        comment.setContent(commentUpdateDto.getContent());
//        comment.setUpvoteCount(commentUpdateDto.getUpvoteCount());
//        comment.setDownvoteCount(commentUpdateDto.getDownvoteCount());
//        comment.setDeleted(commentUpdateDto.isDeleted());
//        comment.setEdited(true);
//        return mapToResponseDto(commentRepository.save(comment));
//    }
//
//    @Transactional
//    public CommentResponseDto editComment(UUID id, CommentEditDto commentEditDto) {
//        Comment comment = findCommentById(id);
//        comment.setContent(commentEditDto.getContent());
//        comment.setEdited(true);
//        return mapToResponseDto(commentRepository.save(comment));
//    }
//
//    @Transactional
//    public void deleteComment(UUID id) {
//        commentRepository.deleteById(id);
//    }
//
//    private Comment findCommentById(UUID id) {
//        return commentRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + id));
//    }
//
//    private CommentResponseDto mapToResponseDto(Comment comment) {
//        return CommentResponseDto.builder()
//                .id(comment.getId())
//                .postId(comment.getPostId())
//                .postType(comment.getPostType())
//                .userId(comment.getUserId())
//                .content(comment.getContent())
//                .createdByUsername(comment.getCreatedByUsername())
//                .parentReplyId(comment.getParentReplyId())
//                .replies(comment.getReplies().stream()
//                        .map(this::mapToResponseDto)
//                        .collect(Collectors.toList()))
//                .upvoteCount(comment.getUpvoteCount())
//                .downvoteCount(comment.getDownvoteCount())
//                .isDeleted(comment.isDeleted())
//                .edited(comment.isEdited())
//                .createdAt(comment.getCreatedAt())
//                .updatedAt(comment.getUpdatedAt())
//                .build();
//    }
}
