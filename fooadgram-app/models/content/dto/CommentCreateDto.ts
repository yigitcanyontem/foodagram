export interface CommentCreateDto {
    content: string;
    postId: string;
    parentId?: string;
    mediaUrls?: string[];
} 