import axios from 'axios';
import { GlobalConstants } from '../utils/GlobalConstants';
import { UsersCompleteDto } from '../models/user/UsersCompleteDto';
import { UsersDto } from '../models/auth/UsersDto';
import { UsersProfileDto } from '../models/user/UsersProfileDto';
import {UsersProfileUpdateDto} from "../models/user/UsersProfileUpdateDto.ts";

export class UserService {
    static userBaseUrl: string = GlobalConstants.baseUrl + 'user';
    static userProfilesBaseUrl: string = GlobalConstants.baseUrl + 'user-profile';
    static userEngagementBaseUrl: string = GlobalConstants.baseUrl + 'user-engagement';

    static getAuthHeaders(userData: any) {
        return {Authorization: userData?.token ?? ''};
    }

    static getLoggedInUser(userData: any): Promise<UsersCompleteDto> {
        return axios.get(`${this.userBaseUrl}/me`, {headers: this.getAuthHeaders(userData)})
            .then(response => response.data)
            .catch(error => {
                console.error('Error while fetching logged-in user:', error);
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

    static getUserProfileByUserId(userId: string): Promise<UsersProfileDto> {
        return axios.get(`${this.userProfilesBaseUrl}/user/${userId}`)
            .then(response => response.data)
            .catch(error => {
                console.error('Error while fetching user profile by user ID:', error);
                throw error;
            });
    }

    static updateUserProfile(updateDto: UsersProfileUpdateDto, userData: any): Promise<UsersProfileDto> {
        return axios.put(this.userProfilesBaseUrl, updateDto, {headers: this.getAuthHeaders(userData)})
            .then(response => response.data)
            .catch(error => {
                console.error('Error while updating user profile:', error);
                throw error;
            });
    }


    static searchUserProfiles(query: string): Promise<UsersProfileDto[]> {
        return axios.get(`${this.userProfilesBaseUrl}/search/${query}`)
            .then(response => response.data)
            .catch(error => {
                console.error('Error while searching user profiles:', error);
                throw error;
            });
    }

    static getUserFollowers(userId: string): Promise<UsersProfileDto[]> {
        return axios.get(`${this.userEngagementBaseUrl}/followers/${userId}`)
            .then(response => response.data)
            .catch(error => {
                console.error('Error while fetching user followers:', error);
                throw error;
            });
    }

    static getUserFollowing(userId: string): Promise<UsersProfileDto[]> {
        return axios.get(`${this.userEngagementBaseUrl}/following/${userId}`)
            .then(response => response.data)
            .catch(error => {
                console.error('Error while fetching user following:', error);
                throw error;
            });
    }

}
