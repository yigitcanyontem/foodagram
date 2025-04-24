package com.foodagram.clients.content.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Wrapper for a feed of posts.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedResponseDto {
    private List<PostResponseDto> posts;
}