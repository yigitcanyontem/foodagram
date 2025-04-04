package com.foodagram.content.repository;

import com.foodagram.content.domain.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, UUID> {
    List<Recipe> findByPost_UserId(UUID userId);
    List<Recipe> findByTitleContainingIgnoreCase(String title);
} 