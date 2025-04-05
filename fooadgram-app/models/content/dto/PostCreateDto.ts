import {Visibility} from '../enums/Visibility';
import {RecipeCreateDto} from './RecipeCreateDto';

export interface PostCreateDto {
    title: string;
    content: string;
    mediaUrls?: string[];
    tags?: string[];
    visibility: Visibility;
    location?: string;
    preparationTime?: number;
    recipe?: RecipeCreateDto;
} 