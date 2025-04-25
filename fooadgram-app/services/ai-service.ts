import axios from 'axios';
import { GlobalConstants } from "@/utils/GlobalConstants";
import { UserRegisterDTO } from "@/models/auth/UserCreateDto";
import { AuthenticationResponse } from "@/models/auth/AuthenticationResponse";
import { AuthenticationRequest } from "@/models/auth/AuthenticationRequest";
import { useAppContext } from '@/context/AppContext';
import {ImagePickerAsset} from "expo-image-picker/src/ImagePicker.types";
import {GenericResponse} from "@/models/shared/GenericResponse";
import {ImageUtil} from "@/utils/ImageUtil";
import {PredictionDto} from "@/models/ai/PredictionDto";

export class AIService {
    static baseUrl: string = GlobalConstants.baseUrl + 'ai';

    static predict(file: ImagePickerAsset): Promise<PredictionDto> {
        const formData = ImageUtil.getFormDataFrom(
            file.uri,
            file.fileName ?? 'media_file.jpg',
        );

        return axios.post(`${this.baseUrl}/predict`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
            .then(response => response.data)
            .catch(error => {
                console.error('Image prediction failed:', error);
                throw error;
            });
    }


    static predictVideo(file: ImagePickerAsset): Promise<PredictionDto> {
        const formData = ImageUtil.getFormDataFrom(
            file.uri,
            file.fileName ?? 'file'
        );


        const isVideo = file.uri.toLowerCase().endsWith('.mp4') || file.mimeType?.includes('video');
        const endpoint = isVideo ? '/process-video/' : '/predict';

        return axios.post(`${this.baseUrl}${endpoint}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
            .then(response => response.data)
            .catch(error => {
                console.error('Prediction failed:', error);
                throw error;
            });
    }

    static predictVideoWithFoodName(file: ImagePickerAsset, foodName: string): Promise<PredictionDto> {
        const formData = ImageUtil.getFormDataFrom(
            file.uri,
            file.fileName ?? 'file'
        );

        const cleanedName = foodName?.trim();
        if (cleanedName && cleanedName.toLowerCase() !== 'none') {
            formData.append("food_name", cleanedName);
        }

        return axios.post(`${this.baseUrl}/process-video/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
            .then(response => response.data)
            .catch(error => {
                console.error('Video verification with food name failed:', error);
                throw error;
            });
    }
    static verify(imageId: string, foodName: string): Promise<PredictionDto> {
        return axios.post(`${this.baseUrl}/verify`, {
            image_id: imageId,
            food_name: foodName
        })
            .then(response => response.data)
            .catch(error => {
                console.error('Verification failed:', error);
                throw error;
            });
    }
}
