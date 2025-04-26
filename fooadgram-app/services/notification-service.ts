import axios from 'axios';
import {GlobalConstants} from "@/utils/GlobalConstants";
import {CommentCreateDto} from "@/models/content/dto/CommentCreateDto";
import {CommentEditDto} from "@/models/content/dto/CommentEditDto";
import {CommentResponseDto} from "@/models/content/dto/CommentResponseDto";
import {CommentVoteCreateDto} from "@/models/content/dto/CommentVoteCreateDto";
import {CommentVoteResponseDto} from "@/models/content/dto/CommentVoteResponseDto";
import {NotificationDto} from "@/models/notification/NotificationDto";
import {GenericResponse} from "@/models/shared/GenericResponse";

export class NotificationService {
    static notificationBaseUrl: string = GlobalConstants.baseUrl + 'notification';

    static getAuthHeaders(userData: any) {
        return {Authorization: userData?.token ?? ''};
    }

    static getMyNotifications(userData: any): Promise<NotificationDto[]> {
        return axios.get(`${this.notificationBaseUrl}/mine`, {headers: this.getAuthHeaders(userData)})
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.error('Fetching notifications failed:', error);
                throw error;
            });
    }

    static getNotificationById(notificationId: string, userData: any): Promise<NotificationDto> {
        return axios.get(`${this.notificationBaseUrl}/${notificationId}`, {headers: this.getAuthHeaders(userData)}).then(response => {
            return response.data;
        }).catch(error => {
            console.error('Fetching notification by ID failed:', error);
            throw error;
        });
    }

    static getUnreadNotificationCount(userData: any): Promise<GenericResponse> {
        return axios.get(`${this.notificationBaseUrl}/unread`, {headers: this.getAuthHeaders(userData)}).then(response => {
            return response.data;
        }).catch(error => {
            console.error('Fetching unread notification count failed:', error);
            throw error;
        });
    }

    // static setNotificationAsRead(notificationIds: string[], userData: any): Promise<void> {
    //     return axios.put(`${this.notificationBaseUrl}/${notificationIds}`, {}, {headers: this.getAuthHeaders(userData)}
    //     ).then(response => {
    //         return response.data;
    //     }).catch(error => {
    //         console.error('Setting notification as read failed:', error);
    //         throw error;
    //     });
    // }

}
