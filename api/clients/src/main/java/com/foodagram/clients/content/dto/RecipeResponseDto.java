package com.foodagram.clients.content.dto;

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
public class RecipeResponseDto {
    private UUID id;
    private UUID postId;
    private String title;
    private String description;
    private List<IngredientResponseDto> ingredients;
    private List<String> instructions;
    private String cuisineType;
    private String difficultyLevel;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 
