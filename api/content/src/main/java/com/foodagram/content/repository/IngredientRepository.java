package com.foodagram.content.repository;

import com.foodagram.content.domain.Ingredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface IngredientRepository extends JpaRepository<Ingredient, UUID> {
    List<Ingredient> findByRecipeId(UUID recipeId);
    List<Ingredient> findByNameContainingIgnoreCase(String name);
} 