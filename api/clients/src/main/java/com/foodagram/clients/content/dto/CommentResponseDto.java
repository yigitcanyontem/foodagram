package com.foodagram.clients.content.dto;

import com.foodagram.clients.content.enums.PostType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentResponseDto {
    private UUID id;
    private UUID postId;
    private UUID userId;
    private String content;
    private String createdByUsername;
    private UUID parentReplyId;
    private List<CommentResponseDto> replies;
    private Long upvoteCount;
    private Long downvoteCount;
    private boolean isDeleted;
    private boolean edited;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
