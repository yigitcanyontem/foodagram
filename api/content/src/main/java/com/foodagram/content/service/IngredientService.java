package com.foodagram.content.service;

import com.foodagram.content.mapper.IngredientMapper;
import com.foodagram.content.repository.IngredientRepository;
import com.foodagram.content.repository.RecipeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class IngredientService {
    private final IngredientRepository ingredientRepository;
    private final IngredientMapper ingredientMapper;
    private final RecipeRepository recipeRepository;
}
