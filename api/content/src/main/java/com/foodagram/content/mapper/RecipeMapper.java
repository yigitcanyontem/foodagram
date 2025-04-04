package com.foodagram.content.mapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RecipeMapper {
    private final IngredientMapper ingredientMapper;

//    public RecipeDTO toDTO(Recipe recipe) {
//        if (recipe == null) return null;
//
//        List<IngredientDTO> ingredientDTOs = null;
//        if (recipe.getIngredients() != null) {
//            ingredientDTOs = ingredientMapper.toDTOList(recipe.getIngredients());
//        }
//
//        return RecipeDTO.builder()
//                .id(recipe.getId())
//                .postId(recipe.getPost().getId())
//                .title(recipe.getTitle())
//                .description(recipe.getDescription())
//                .ingredients(ingredientDTOs)
//                .instructions(recipe.getInstructions())
//                .createdAt(recipe.getCreatedDate())
//                .updatedAt(recipe.getUpdatedDate())
//                .build();
//    }
//
//    public Recipe toDomain(RecipeDTO dto) {
//        if (dto == null) return null;
//
//        return Recipe.builder()
//                .id(dto.getId())
//                .title(dto.getTitle())
//                .description(dto.getDescription())
//                .instructions(dto.getInstructions())
//                .build();
//    }
//
//    public List<RecipeDTO> toDTOList(List<Recipe> recipes) {
//        if (recipes == null) return null;
//        return recipes.stream()
//                .map(this::toDTO)
//                .collect(Collectors.toList());
//    }
} 
