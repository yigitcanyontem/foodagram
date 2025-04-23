package com.foodagram.clients.content.dto;

import com.foodagram.clients.content.enums.Visibility;
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
public class PostResponseDto {
    private UUID id;
    private UUID userId;
    private String title;
    private String content;
    private List<String> mediaUrls;
    private List<String> tags;
    private Visibility visibility;
    private String location;
    private Long processTime;
    private RecipeResponseDto recipe;
    private Long likes;
    private Long comments;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String username;
    private Long saves;
} 
