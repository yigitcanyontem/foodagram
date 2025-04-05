package com.foodagram.clients.content.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecipeCreateDto {
    private String title;
    private String description;
    private List<IngredientCreateDto> ingredients;
    private List<String> instructions;
    private String cuisineType;
    private String difficultyLevel;
    private Integer prepTime;
} 
