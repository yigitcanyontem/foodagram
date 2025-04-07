import axios from 'axios';
import { GlobalConstants } from "@/utils/GlobalConstants";
import { UserRegisterDTO } from "@/models/auth/UserCreateDto";
import { AuthenticationResponse } from "@/models/auth/AuthenticationResponse";
import { AuthenticationRequest } from "@/models/auth/AuthenticationRequest";
import { useAppContext } from '@/context/AppContext';
import {ImagePickerAsset} from "expo-image-picker/src/ImagePicker.types";
import {GenericResponse} from "@/models/shared/GenericResponse";
import {ImageUtil} from "@/utils/ImageUtil";

export class AIService {
    static baseUrl: string = GlobalConstants.baseUrl + 'ai';

    static predict(file: ImagePickerAsset): Promise<any> {
        let fileUri = file.uri;

        const formData = ImageUtil.getFormDataFrom(
            fileUri,
            file.fileName ? file.fileName : 'media_file.jpg',
        );

        return axios.post(`${this.baseUrl}/predict`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(response => response.data)
            .catch(error => {
                console.error('Prediction failed:', error);
                throw error;
            });
    }

}
