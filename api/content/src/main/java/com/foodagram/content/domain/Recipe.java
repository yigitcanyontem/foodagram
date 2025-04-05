package com.foodagram.content.domain;

import com.foodagram.clients.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "recipes")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
//TODO add serving
public class Recipe extends BaseEntity {
    @OneToOne
    @JoinColumn(name = "post_id", nullable = false)
    private Post post; // Links to a post

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @OneToMany(mappedBy = "recipe", cascade = {CascadeType.MERGE, CascadeType.PERSIST}, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<Ingredient> ingredients = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "recipe_instructions", joinColumns = @JoinColumn(name = "recipe_id"))
    @Column(name = "instruction", columnDefinition = "TEXT")
    private List<String> instructions = new ArrayList<>();

    @Column
    private String cuisineType;

    @Column
    private String difficultyLevel;

    private Integer prepTime; //in minutes
}
