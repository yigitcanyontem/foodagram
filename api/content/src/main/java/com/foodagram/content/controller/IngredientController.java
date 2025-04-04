package com.foodagram.content.controller;

import com.foodagram.content.service.IngredientService;
import com.foodagram.content.util.UsersUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/ingredients")
@RequiredArgsConstructor
public class IngredientController {
    private final IngredientService ingredientService;
    private final UsersUtil usersUtil;


} 
