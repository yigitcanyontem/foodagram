import {IngredientUpdateDto} from './IngredientUpdateDto';

export interface RecipeUpdateDto {
    title?: string;
    description?: string;
    ingredients?: IngredientUpdateDto[];
    instructions?: string[];
    preparationTime?: number;
    cookingTime?: number;
    servings?: number;
    difficulty?: string;
    cuisine?: string;
    mealType?: string;
    dietaryRestrictions?: string[];
    prepTime: number;
}
