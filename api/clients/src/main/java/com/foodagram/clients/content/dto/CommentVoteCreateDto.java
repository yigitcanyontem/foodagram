package com.foodagram.clients.content.dto;

import com.foodagram.clients.content.enums.VoteType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentVoteCreateDto {
    private UUID commentId;
    private VoteType voteType;
} 