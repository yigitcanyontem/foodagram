package com.foodagram.content.service;

import com.foodagram.amqp.RabbitMQMessageProducer;
import com.foodagram.clients.content.dto.*;
import com.foodagram.clients.notification.NotificationCreateDto;
import com.foodagram.clients.notification.dto.NotificationType;
import com.foodagram.clients.shared.dto.GenericRabbitMQMessage;
import com.foodagram.clients.shared.dto.PaginatedResponse;
import com.foodagram.clients.users.dto.UsersDto;
import com.foodagram.content.domain.Comment;
import com.foodagram.content.domain.Post;
import com.foodagram.content.rabbitmq.AMQPService;
import com.foodagram.content.repository.CommentRepository;
import com.foodagram.content.repository.PostRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.ws.rs.ForbiddenException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final RabbitMQMessageProducer rabbitMQMessageProducer;
    private final AMQPService aMQPService;

    public CommentResponseDto createComment(CommentCreateDto commentCreateDto) {
        Post post = postRepository.findById(commentCreateDto.getPostId())
                .orElseThrow(() -> new EntityNotFoundException("Post not found"));

        Comment comment = Comment.builder()
                .post(post)
                .userId(commentCreateDto.getUserId())
                .content(commentCreateDto.getContent())
                .createdByUsername(commentCreateDto.getCreatedByUsername())
                .parentReply(commentCreateDto.getParentReplyId() != null
                        ? Comment.builder().id(commentCreateDto.getParentReplyId()).build()
                        : null)
                .upvoteCount(0L)
                .downvoteCount(0L)
                .build();

        Comment saved = commentRepository.save(comment);

        rabbitMQMessageProducer.publish(
                new GenericRabbitMQMessage("updatePostComments", post.getId()),
                "internal.exchange",
                "internal.content.routing-key"
        );

        if (!saved.getUserId().equals(post.getUserId())) {
            aMQPService.publishToNotificationQueue(
                    new GenericRabbitMQMessage(
                            "createNotification",
                            new NotificationCreateDto(
                                    post.getUserId(),
                                    "New Comment",
                                    saved.getContent(),
                                    NotificationType.COMMENT,
                                    "PostDetail/" + post.getId(),
                                    saved.getUserId()
                            )
                    )
            );
        }

        return mapToResponseDto(commentRepository.save(saved));
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


    public void deleteComment(UUID id, UsersDto user) {

        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + id));

        throwIfUserIsNotOwnerOfComment(comment.getUserId(), user.getId());

        markDeletedRecursive(comment);

        rabbitMQMessageProducer.publish(
                new GenericRabbitMQMessage("updatePostComments",
                        comment.getPost().getId()),
                "internal.exchange",
                "internal.content.routing-key"
        );
    }


    private void markDeletedRecursive(Comment c) {
        c.setDeleted(true);
        c.setContent("This comment has been deleted");

        if (c.getReplies() != null && !c.getReplies().isEmpty()) {
            c.getReplies().forEach(this::markDeletedRecursive);
        }
        commentRepository.save(c);        // JPA cascades to children because of mappedBy
    }


    private CommentResponseDto mapToResponseDto(Comment comment) {
        return CommentResponseDto.builder()
                .id(comment.getId())
                .postId(comment.getPost().getId())
                .userId(comment.getUserId())
                .content(comment.getContent())
                .createdByUsername(comment.getCreatedByUsername())
                .parentReplyId(comment.getParentReply() != null ? comment.getParentReply().getId() : null)
                .replies(comment.getReplies() != null && !comment.getReplies().isEmpty() ? comment.getReplies().stream().map(this::mapToResponseDto).toList() : null)
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

    public PaginatedResponse getCommentsByPost(UUID postId, int page, int size) {
        if (page < 0 || size <= 0) {
            throw new IllegalArgumentException("Page and size must be greater than 0");
        }

        Pageable pageable = Pageable.ofSize(size).withPage(page);

        Page<Comment> comments = commentRepository
                .findByPostIdAndIsDeletedFalse(postId, pageable);

        PaginatedResponse paginatedResponse =
                new PaginatedResponse(
                        comments.getContent().stream()
                                .map(this::mapToResponseDto)
                                .toList(),
                        page,
                        size,
                        comments.getTotalElements(),
                        comments.getTotalPages()
                );
        return paginatedResponse;
    }

    public long getCommentCountByPost(UUID postId) {
        return commentRepository.countByPost_IdAndIsDeletedFalse(postId);
    }

    public void deleteCommentsByPostId(UUID postId) {
        List<Comment> comments = commentRepository.findByPostId(postId);
        for (Comment comment : comments) {
            comment.setDeleted(true);
            comment.setContent("This comment has been deleted");
            comment.setPost(null);
            commentRepository.save(comment);
        }

    }
}
