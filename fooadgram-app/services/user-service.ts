import axios from 'axios';
import {UsersDto} from "@/models/auth/UsersDto";
import {UsersCompleteDto} from "@/models/user/UsersCompleteDto";
import {UsersProfileDto} from "@/models/user/UsersProfileDto";
import {UsersProfileCreateDto} from "@/models/user/UsersProfileCreateDto";
import {UsersProfileUpdateDto} from "@/models/user/UsersProfileUpdateDto";
import {GlobalConstants} from "@/utils/GlobalConstants";
import {ImagePickerAsset} from "expo-image-picker/src/ImagePicker.types";
import {ImageUtil} from "@/utils/ImageUtil";

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

    static saveUserProfile(createDto: UsersProfileCreateDto, userData: any): Promise<UsersProfileDto> {
        return axios.post(this.userProfilesBaseUrl, createDto, {headers: this.getAuthHeaders(userData)})
            .then(response => response.data)
            .catch(error => {
                console.error('Error while saving user profile:', error);
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

    static followUser(engagedUserId: string, userData: any): Promise<void> {
        return axios.put(`${this.userEngagementBaseUrl}/follow/${engagedUserId}`, {}, {headers: this.getAuthHeaders(userData)})
            .then(response => response.data)
            .catch(error => {
                console.error('Error while following user:', error);
                throw error;
            });
    }

    static unfollowUser(engagedUserId: string, userData: any): Promise<void> {
        return axios.put(`${this.userEngagementBaseUrl}/unfollow/${engagedUserId}`, {}, {headers: this.getAuthHeaders(userData)})
            .then(response => response.data)
            .catch(error => {
                console.error('Error while unfollowing user:', error);
                throw error;
            });
    }

    static async uploadProfilePicture(file: ImagePickerAsset, userData: any): Promise<void> {
        let fileUri = file.uri;

        const formData = ImageUtil.getFormDataFrom(
            fileUri,
            file.fileName ? file.fileName : 'profile_picture.jpg',
        );

        return axios.post(`${this.userProfilesBaseUrl}/upload-profile-picture`, formData, {
            headers: {
                ...this.getAuthHeaders(userData),
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(response => response.data)
            .catch(error => {
                console.error('Error while uploading profile picture:', error);
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

}
