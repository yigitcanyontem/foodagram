package com.foodagram.clients.content.dto;

import com.foodagram.clients.content.enums.PostType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentCreateDto {
    private UUID postId;
    private UUID userId;
    private String content;
    private String createdByUsername;
    private UUID parentReplyId;
} 
