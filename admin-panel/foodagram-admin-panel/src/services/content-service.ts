import axios from 'axios';
import {GlobalConstants} from "../utils/GlobalConstants.ts";
import {PostResponseDto} from "../models/content/dto/PostResponseDto.ts";
import {PostUpdateDto} from "../models/content/dto/PostUpdateDto.ts";
import {AuthService} from "./auth-service.ts";


export class ContentService {
    static postsBaseUrl: string = GlobalConstants.baseUrl + 'posts';
    static contentMediaBaseUrl: string = GlobalConstants.baseUrl + 'content-media';

    static getAuthHeaders() {
        return {Authorization: AuthService.getUserData().token ?? ''};
    }

    static getPost(id: string): Promise<PostResponseDto> {
        return axios.get(`${this.postsBaseUrl}/${id}`, {headers: this.getAuthHeaders()})
            .then(response => response.data)
            .catch(error => {
                console.error('Error while fetching post:', error);
                throw error;
            });
    }

    static getAllPostsByUser(userId: string): Promise<PostResponseDto[]> {
        return axios.get(`${this.postsBaseUrl}/user/${userId}`)
            .then(response => response.data)
            .catch(error => {
                console.error('Error while fetching posts by user:', error);
                throw error;
            });
    }

    static updatePost(id: string, updateDto: PostUpdateDto, userData: any): Promise<PostResponseDto> {
        return axios.put(`${this.postsBaseUrl}/${id}`, updateDto, {headers: this.getAuthHeaders(userData)})
            .then(response => response.data)
            .catch(error => {
                console.error('Error while updating post:', error);
                throw error;
            });
    }

    static deletePost(id: string): Promise<void> {
        return axios.delete(`${this.postsBaseUrl}/${id}`, {headers: this.getAuthHeaders()})
            .then(response => response.data)
            .catch(error => {
                console.error('Error while deleting post:', error);
                throw error;
            });
    }

    static getAllPosts(): Promise<PostResponseDto[]> {
        return axios.get(this.postsBaseUrl)
            .then(response => response.data)
            .catch(error => {
                console.error('Error while fetching all posts:', error);
                throw error;
            });
    }

}
