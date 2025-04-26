import {IngredientCreateDto} from './IngredientCreateDto';

export interface RecipeCreateDto {
    title: string;
    description: string;
    ingredients: IngredientCreateDto[];
    instructions: string[];
    cuisineType: string;
    difficultyLevel: string;
    prepTime: number;
}
