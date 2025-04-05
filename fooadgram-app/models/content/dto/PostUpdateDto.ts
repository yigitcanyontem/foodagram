import {Visibility} from '../enums/Visibility';
import {RecipeUpdateDto} from './RecipeUpdateDto';

export interface PostUpdateDto {
    title?: string;
    content?: string;
    mediaUrls?: string[];
    tags?: string[];
    visibility?: Visibility;
    location?: string;
    preparationTime?: number;
    recipe?: RecipeUpdateDto;
    likes?: number;
    comments?: number;
} 