import axios from 'axios';
import { UsersDto } from "@/models/auth/UsersDto";
import {UsersCompleteDto} from "@/models/user/UsersCompleteDto";
import {UsersProfileDto} from "@/models/user/UsersProfileDto";
import {UsersProfileCreateDto} from "@/models/user/UsersProfileCreateDto";
import {UsersProfileUpdateDto} from "@/models/user/UsersProfileUpdateDto";
import {GlobalConstants} from "@/utils/GlobalConstants";

export class UserService {
    static userBaseUrl: string = GlobalConstants.baseUrl + 'user';
    static userProfilesBaseUrl: string = GlobalConstants.baseUrl + 'user-profile';
    static userEngagementBaseUrl: string = GlobalConstants.baseUrl + 'user-engagement';

    static getLoggedInUser(): Promise<UsersCompleteDto> {
        return axios.get(`${this.userBaseUrl}/me`, {
            headers: { 'Authorization': sessionStorage.getItem('token') }
        })
        .then(response => response.data)
        .catch(error => {
            console.error('Error while fetching logged in user:', error);
            throw error;
        });
    }

    static getUsersByUsername(username: string): Promise<UsersDto> {
        return axios.get(`${this.userBaseUrl}/username/${username}`)
        .then(response => response.data)
        .catch(error => {
            console.error('Error while fetching user profile by username:', error);
            throw error;
        });
    }

    static getUserProfileByUserId(userId: number): Promise<UsersProfileDto> {
        return axios.get(`${this.userProfilesBaseUrl}/user/${userId}`)
        .then(response => response.data)
        .catch(error => {
            console.error('Error while fetching user profile by user id:', error);
            throw error;
        });
    }

    static saveUserProfile(createDto: UsersProfileCreateDto): Promise<UsersProfileDto> {
        return axios.post(this.userProfilesBaseUrl, createDto, {
            headers: { 'Authorization': sessionStorage.getItem('token') }
        })
        .then(response => response.data)
        .catch(error => {
            console.error('Error while saving user profile:', error);
            throw error;
        });
    }

    static updateUserProfile(updateDto: UsersProfileUpdateDto): Promise<UsersProfileDto> {
        return axios.put(this.userProfilesBaseUrl, updateDto, {
            headers: { 'Authorization': sessionStorage.getItem('token') }
        })
        .then(response => response.data)
        .catch(error => {
            console.error('Error while updating user profile:', error);
            throw error;
        });
    }

    static followUser(engagedUserId: number): Promise<void> {
        return axios.put(this.userEngagementBaseUrl + '/follow/' + engagedUserId, {}, {
            headers: { 'Authorization': sessionStorage.getItem('token') }
        })
            .then(response => response.data)
            .catch(error => {
                console.error('Error while following user:', error);
                throw error;
            });
    }

    static unfollowUser(engagedUserId: number): Promise<void> {
        return axios.put(this.userEngagementBaseUrl + '/unfollow/' + engagedUserId, {}, {
            headers: { 'Authorization': sessionStorage.getItem('token') }
        })
            .then(response => response.data)
            .catch(error => {
                console.error('Error while unfollowing:', error);
                throw error;
            });
    }
}
