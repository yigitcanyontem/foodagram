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

    // First call - image upload and initial prediction
    static predict(file: ImagePickerAsset): Promise<PredictionDto> {
        const formData = ImageUtil.getFormDataFrom(
            file.uri,
            file.fileName ?? 'media_file.jpg',
        );

        return axios.post(`${this.baseUrl}/predict`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
            .then(response => response.data);
    }

    // Second call - verify the food name with image id
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
