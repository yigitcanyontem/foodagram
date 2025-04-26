import {VoteType} from '../enums/VoteType';

export interface CommentVoteResponseDto {
    id: string;
    userId: string;
    commentId: string;
    voteType: VoteType;
    createdAt: string;
    updatedAt: string;
} 