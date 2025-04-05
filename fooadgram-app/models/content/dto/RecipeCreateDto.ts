import {IngredientCreateDto} from './IngredientCreateDto';

export interface RecipeCreateDto {
    title: string;
    description: string;
    ingredients: IngredientCreateDto[];
    instructions: string[];
    preparationTime: number;
    cookingTime: number;
    servings: number;
    difficulty: string;
    cuisine: string;
    mealType: string;
    dietaryRestrictions?: string[];
} 