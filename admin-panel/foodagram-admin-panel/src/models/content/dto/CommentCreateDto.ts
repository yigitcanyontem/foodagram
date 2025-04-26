export interface CommentCreateDto {
    content: string;
    postId: string;
    parentReplyId?: string;
    createdByUsername?: string;
}

