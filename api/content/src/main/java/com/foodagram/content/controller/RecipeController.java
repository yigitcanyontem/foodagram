package com.foodagram.content.controller;

import com.foodagram.content.service.RecipeService;
import com.foodagram.content.util.UsersUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/recipes")
@RequiredArgsConstructor
public class RecipeController {
    private final RecipeService recipeService;
    private final UsersUtil usersUtil;

} 
