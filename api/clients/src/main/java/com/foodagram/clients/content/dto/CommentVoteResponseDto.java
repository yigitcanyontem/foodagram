package com.foodagram.clients.content.dto;

import com.foodagram.clients.content.enums.VoteType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentVoteResponseDto {
    private UUID id;
    private UUID commentId;
    private UUID userId;
    private VoteType voteType;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 