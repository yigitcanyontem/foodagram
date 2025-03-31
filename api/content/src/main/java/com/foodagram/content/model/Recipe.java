package com.foodagram.content.model;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
public class Recipe extends Post {
    private String title;
    private String description;
    private List<Ingredient> ingredients;
    private List<String> instructions;
    private int prepTime; // in minutes
    private int cookTime; // in minutes
    private int servings;
    private Difficulty difficulty;

    public enum Difficulty {
        EASY, MEDIUM, HARD
    }
} 