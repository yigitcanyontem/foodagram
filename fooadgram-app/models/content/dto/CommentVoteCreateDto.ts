import {VoteType} from '../enums/VoteType';

export interface CommentVoteCreateDto {
    commentId: string;
    voteType: VoteType;
} 