import axios from 'axios';
import {GlobalConstants} from "@/utils/GlobalConstants";
import {ImagePickerAsset} from "expo-image-picker/src/ImagePicker.types";
import {ImageUtil} from "@/utils/ImageUtil";
import {GenericResponse} from "@/models/shared/GenericResponse";
import {PostResponseDto} from "@/models/content/dto/PostResponseDto";
import {PostCreateDto} from "@/models/content/dto/PostCreateDto";
import {PostUpdateDto} from "@/models/content/dto/PostUpdateDto";
import {UsersProfileDto} from "@/models/user/UsersProfileDto";


export class ContentService {
    static postsBaseUrl: string = GlobalConstants.baseUrl + 'posts';
    static contentMediaBaseUrl: string = GlobalConstants.baseUrl + 'content-media';

    static getAuthHeaders(userData: any) {
        return {Authorization: userData?.token ?? ''};
    }

    // Post endpoints
    static createPost(createDto: PostCreateDto, userData: any): Promise<PostResponseDto> {
        return axios.post(this.postsBaseUrl, createDto, {headers: this.getAuthHeaders(userData)})
            .then(response => response.data)
            .catch(error => {
                console.error('Error while creating post:', error);
                throw error;
            });
    }

    static getPost(id: string, userData: any): Promise<PostResponseDto> {
        return axios.get(`${this.postsBaseUrl}/${id}`, {headers: this.getAuthHeaders(userData)})
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

    static deletePost(id: string, userData: any): Promise<void> {
        return axios.delete(`${this.postsBaseUrl}/${id}`, {headers: this.getAuthHeaders(userData)})
            .then(response => response.data)
            .catch(error => {
                console.error('Error while deleting post:', error);
                throw error;
            });
    }

    // File upload endpoint
    static async uploadMedia(file: ImagePickerAsset, userData: any): Promise<GenericResponse> {
        let fileUri = file.uri;

        const formData = ImageUtil.getFormDataFrom(
            fileUri,
            file.fileName ? file.fileName : 'media_file.jpg',
        );

        return axios.post(`${this.contentMediaBaseUrl}/upload`, formData, {
            headers: {
                ...this.getAuthHeaders(userData),
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(response => response.data)
            .catch(error => {
                console.error('Error while uploading media:', error);
                throw error;
            });
    }

    // Like endpoints
    static likePost(postId: string, userData: any): Promise<void> {
        return axios.post(`${this.postsBaseUrl}/likes/${postId}`, null, { headers: this.getAuthHeaders(userData) })
            .then(response => response.data)
            .catch(error => {
                console.error('Error while liking post:', error);
                throw error;
            });
    }

    static unlikePost(postId: string, userData: any): Promise<void> {
        return axios.delete(`${this.postsBaseUrl}/likes/${postId}`, { headers: this.getAuthHeaders(userData) })
            .then(response => response.data)
            .catch(error => {
                console.error('Error while unliking post:', error);
                throw error;
            });
    }

    static hasUserLikedPost(postId: string, userData: any): Promise<boolean> {
        return axios.get(`${this.postsBaseUrl}/likes/${postId}`, { headers: this.getAuthHeaders(userData) })
            .then(response => response.data)
            .catch(error => {
                console.error('Error while checking if user liked post:', error);
                throw error;
            });
    }

    static getUsersWhoLikedPost(postId: string): Promise<UsersProfileDto[]> {
        return axios.get(`${this.postsBaseUrl}/likes/users/${postId}`)
            .then(response => response.data)
            .catch(error => {
                console.error('Error while fetching users who liked post:', error);
                throw error;
            });
    }
} 
