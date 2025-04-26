import {IngredientEditDto} from './IngredientEditDto';

export interface RecipeEditDto {
    title?: string;
    description?: string;
    ingredients?: IngredientEditDto[];
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
