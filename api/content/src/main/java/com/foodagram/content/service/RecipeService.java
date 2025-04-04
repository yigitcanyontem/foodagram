package com.foodagram.content.service;

import com.foodagram.content.mapper.IngredientMapper;
import com.foodagram.content.mapper.RecipeMapper;
import com.foodagram.content.repository.PostRepository;
import com.foodagram.content.repository.RecipeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RecipeService {
    private final RecipeRepository recipeRepository;
    private final RecipeMapper recipeMapper;
    private final IngredientMapper ingredientMapper;
    private final PostRepository postRepository;

} 
