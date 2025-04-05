export interface CommentResponseDto {
    id: string;
    content: string;
    userId: string;
    postId: string;
    parentId?: string;
    mediaUrls: string[];
    likes: number;
    replies: number;
    createdAt: string;
    updatedAt: string;
} 