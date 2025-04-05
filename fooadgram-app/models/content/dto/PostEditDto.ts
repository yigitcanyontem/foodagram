import {Visibility} from '../enums/Visibility';
import {RecipeEditDto} from './RecipeEditDto';

export interface PostEditDto {
    title?: string;
    content?: string;
    mediaUrls?: string[];
    tags?: string[];
    visibility?: Visibility;
    location?: string;
    preparationTime?: number;
    recipe?: RecipeEditDto;
} 