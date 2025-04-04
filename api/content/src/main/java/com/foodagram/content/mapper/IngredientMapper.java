package com.foodagram.content.mapper;

import com.foodagram.content.domain.Ingredient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class IngredientMapper {

//    public IngredientDTO toDTO(Ingredient ingredient) {
//        if (ingredient == null) return null;
//
//        return IngredientDTO.builder()
//                .id(ingredient.getId())
//                .recipeId(ingredient.getRecipe().getId())
//                .name(ingredient.getName())
//                .amount(ingredient.getAmount())
//                .unit(ingredient.getUnit())
//                .createdAt(ingredient.getCreatedDate())
//                .updatedAt(ingredient.getUpdatedDate())
//                .build();
//    }
//
//    public Ingredient toDomain(IngredientDTO dto) {
//        if (dto == null) return null;
//
//        return Ingredient.builder()
//                .id(dto.getId())
//                .name(dto.getName())
//                .amount(dto.getAmount())
//                .unit(dto.getUnit())
//                .build();
//    }
//
//    public List<IngredientDTO> toDTOList(List<Ingredient> ingredients) {
//        if (ingredients == null) return null;
//        return ingredients.stream()
//                .map(this::toDTO)
//                .collect(Collectors.toList());
//    }
} 
