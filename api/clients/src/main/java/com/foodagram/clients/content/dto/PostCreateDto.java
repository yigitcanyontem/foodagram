package com.foodagram.clients.content.dto;

import com.foodagram.clients.content.enums.Visibility;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostCreateDto {
    private UUID userId;
    private String title;
    private String content;
    private List<String> mediaUrls;
    private List<String> tags;
    private Visibility visibility;
    private String location;
    private RecipeCreateDto recipe;
} 
