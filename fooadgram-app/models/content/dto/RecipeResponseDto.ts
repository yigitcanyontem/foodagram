import {IngredientResponseDto} from './IngredientResponseDto';

export interface RecipeResponseDto {
    id: string;
    title: string;
    description: string;
    ingredients: IngredientResponseDto[];
    instructions: string[];
    preparationTime: number;
    cookingTime: number;
    servings: number;
    difficulty: string;
    cuisine: string;
    mealType: string;
    dietaryRestrictions?: string[];
    createdAt: string;
    updatedAt: string;
} 