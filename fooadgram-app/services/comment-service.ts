import axios from 'axios';
    import {GlobalConstants} from "@/utils/GlobalConstants";
    import {CommentCreateDto} from "@/models/content/dto/CommentCreateDto";
    import {CommentEditDto} from "@/models/content/dto/CommentEditDto";
    import {CommentResponseDto} from "@/models/content/dto/CommentResponseDto";
    import {CommentVoteCreateDto} from "@/models/content/dto/CommentVoteCreateDto";
    import {CommentVoteResponseDto} from "@/models/content/dto/CommentVoteResponseDto";
import {PaginatedResponse} from "@/models/shared/PaginatedResponse";

    export class CommentService {
        static commentsBaseUrl: string = GlobalConstants.baseUrl + 'comments';
        static commentVoteBaseUrl: string = GlobalConstants.baseUrl + 'comment-votes';

        static getAuthHeaders(userData: any) {
            return {Authorization: userData?.token ?? ''};
        }

        // Comment endpoints
        static createComment(createDto: CommentCreateDto, userData: any): Promise<CommentResponseDto> {
            return axios.post(this.commentsBaseUrl, createDto, {headers: this.getAuthHeaders(userData)})
                .then(response => response.data)
                .catch(error => {
                    console.error('Error while creating comment:', error);
                    throw error;
                });
        }

        static getComment(id: string, userData: any): Promise<CommentResponseDto> {
            return axios.get(`${this.commentsBaseUrl}/${id}`, {headers: this.getAuthHeaders(userData)})
                .then(response => response.data)
                .catch(error => {
                    console.error('Error while fetching comment:', error);
                    throw error;
                });
        }

        static getCommentsByPost(postId: string, userData: any, page: number, pageSize: number): Promise<PaginatedResponse> {
            return axios.get(`${this.commentsBaseUrl}/post/${postId}?page=${page}&size=${pageSize}`, {headers: this.getAuthHeaders(userData)})
                .then(response => response.data)
                .catch(error => {
                    console.error('Error while fetching comments by post:', error);
                    throw error;
                });
        }

        static updateComment(id: string, editDto: CommentEditDto, userData: any): Promise<CommentResponseDto> {
            return axios.put(`${this.commentsBaseUrl}/${id}`, editDto, {headers: this.getAuthHeaders(userData)})
                .then(response => response.data)
                .catch(error => {
                    console.error('Error while updating comment:', error);
                    throw error;
                });
        }

        static deleteComment(id: string, userData: any): Promise<void> {
            return axios.delete(`${this.commentsBaseUrl}/${id}`, {headers: this.getAuthHeaders(userData)})
                .then(response => response.data)
                .catch(error => {
                    console.error('Error while deleting comment:', error);
                    throw error;
                });
        }

        // Comment vote endpoints
        static createCommentVote(createDto: CommentVoteCreateDto, userData: any): Promise<CommentVoteResponseDto> {
            return axios.post(this.commentVoteBaseUrl, createDto, {headers: this.getAuthHeaders(userData)})
                .then(response => response.data)
                .catch(error => {
                    console.error('Error while creating comment vote:', error);
                    throw error;
                });
        }

        static getCommentVote(id: string, userData: any): Promise<CommentVoteResponseDto> {
            return axios.get(`${this.commentVoteBaseUrl}/${id}`, {headers: this.getAuthHeaders(userData)})
                .then(response => response.data)
                .catch(error => {
                    console.error('Error while fetching comment vote:', error);
                    throw error;
                });
        }

        static getCommentVotesByComment(commentId: string, userData: any): Promise<CommentVoteResponseDto[]> {
            return axios.get(`${this.commentVoteBaseUrl}/post/${commentId}`, {headers: this.getAuthHeaders(userData)})
                .then(response => response.data)
                .catch(error => {
                    console.error('Error while fetching comment votes by comment:', error);
                    throw error;
                });
        }

        static deleteCommentVote(id: string, userData: any): Promise<void> {
            return axios.delete(`${this.commentVoteBaseUrl}/${id}`, {headers: this.getAuthHeaders(userData)})
                .then(response => response.data)
                .catch(error => {
                    console.error('Error while deleting comment vote:', error);
                    throw error;
                });
        }
    }
