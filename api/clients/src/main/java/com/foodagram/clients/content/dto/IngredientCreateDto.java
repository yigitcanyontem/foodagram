package com.foodagram.clients.content.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IngredientCreateDto {
    private String name;
    private String amount;
    private String unit;
} 
