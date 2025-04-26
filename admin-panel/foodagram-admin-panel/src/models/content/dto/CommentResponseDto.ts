export interface CommentResponseDto {
    id: string;
    postId: string;
    userId: string;
    content: string;
    createdByUsername: string;
    parentReplyId?: string | null;
    replies: CommentResponseDto[];
    upvoteCount: number;
    downvoteCount: number;
    isDeleted: boolean;
    edited: boolean;
    createdAt: string; // ISO string (e.g., "2025-04-09T11:47:58.124Z")
    updatedAt: string;
}
