package com.foodagram.clients.content.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecipeUpdateDto {
    private UUID id;
    private UUID postId;
    private String title;
    private String description;
    private List<IngredientUpdateDto> ingredients;
    private List<String> instructions;
    private String cuisineType;
    private String difficultyLevel;
} 
