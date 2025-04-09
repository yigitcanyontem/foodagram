package com.foodagram.content.service;

import com.foodagram.clients.content.dto.*;
import com.foodagram.clients.users.dto.UsersDto;
import com.foodagram.content.domain.Comment;
import com.foodagram.content.domain.Post;
import com.foodagram.content.repository.CommentRepository;
import jakarta.ws.rs.ForbiddenException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;

    public CommentResponseDto createComment(CommentCreateDto commentCreateDto) {
        Comment comment = Comment.builder()
                .post(Post.builder().id(commentCreateDto.getPostId()).build())
                .postType(commentCreateDto.getPostType())
                .userId(commentCreateDto.getUserId())
                .content(commentCreateDto.getContent())
                .createdByUsername(commentCreateDto.getCreatedByUsername())
                .parentReply(commentCreateDto.getParentReplyId() != null
                        ? Comment.builder().id(commentCreateDto.getParentReplyId()).build()
                        : null)
                .upvoteCount(0L)
                .downvoteCount(0L)
                .build();
        return mapToResponseDto(commentRepository.save(comment));
    }

    public CommentResponseDto getCommentById(UUID id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + id));
        return mapToResponseDto(comment);
    }

    public CommentResponseDto updateComment(UUID id, CommentEditDto commentEditDto, UsersDto usersDto) {

        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + id));

        throwIfUserIsNotOwnerOfComment(comment.getUserId(), usersDto.getId());

        comment.setContent(commentEditDto.getContent());
        comment.setEdited(true);
        return mapToResponseDto(commentRepository.save(comment));
    }

    public void deleteComment(UUID id, UsersDto usersDto) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + id));

        throwIfUserIsNotOwnerOfComment(comment.getUserId(), usersDto.getId());

        comment.setDeleted(true);
        comment.setContent("This comment has been deleted");
        commentRepository.save(comment);
    }

    private CommentResponseDto mapToResponseDto(Comment comment) {
        return CommentResponseDto.builder()
                .id(comment.getId())
                .postId(comment.getPost().getId())
                .postType(comment.getPostType())
                .userId(comment.getUserId())
                .content(comment.getContent())
                .createdByUsername(comment.getCreatedByUsername())
                .parentReplyId(comment.getParentReply() != null ? comment.getParentReply().getId() : null)
                .replies(comment.getReplies().stream().map(this::mapToResponseDto).toList())
                .upvoteCount(comment.getUpvoteCount())
                .downvoteCount(comment.getDownvoteCount())
                .isDeleted(comment.isDeleted())
                .edited(comment.isEdited())
                .createdAt(comment.getCreatedDate())
                .updatedAt(comment.getUpdatedDate())
                .build();
    }

    private void throwIfUserIsNotOwnerOfComment(UUID userId, UUID creatorId) {
        if (!userId.equals(creatorId)) {
            throw new ForbiddenException("You are not owner of this comment");
        }
    }

    public List<CommentResponseDto> getCommentsByPost(UUID postId) {
        return commentRepository.findByPostId(postId).stream().map(this::mapToResponseDto).toList();
    }
}
