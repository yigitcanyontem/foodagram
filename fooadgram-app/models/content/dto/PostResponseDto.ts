import {Visibility} from '../enums/Visibility';
import {RecipeResponseDto} from './RecipeResponseDto';

export interface PostResponseDto {
    id: string;
    userId: string;
    title: string;
    content: string;
    mediaUrls: string[];
    tags: string[];
    visibility: Visibility;
    location?: string;
    preparationTime?: number;
    recipe?: RecipeResponseDto;
    likes: number;
    comments: number;
    createdAt: string;
    updatedAt: string;
} 