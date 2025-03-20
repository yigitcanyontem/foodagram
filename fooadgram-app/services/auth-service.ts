import axios from 'axios';
import { GlobalConstants } from "@/utils/GlobalConstants";
import { UserRegisterDTO } from "@/models/auth/UserCreateDto";
import { AuthenticationResponse } from "@/models/auth/AuthenticationResponse";
import { AuthenticationRequest } from "@/models/auth/AuthenticationRequest";
import { useAppContext } from '@/context/AppContext';

export class AuthService {
    static baseUrl: string = GlobalConstants.baseUrl + 'auth';

    static authenticate(request: AuthenticationRequest): Promise<AuthenticationResponse> {
        return axios.post(`${this.baseUrl}/login`, request)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.error('Login failed:', error);
                throw error;
            });
    }

    static register(request: UserRegisterDTO): Promise<AuthenticationResponse> {
        return axios.post(`${this.baseUrl}/register`, request)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.error('Registration failed:', error);
                throw error;
            });
    }

    // static logout() {
    //     const { setUserData } = useAppContext();
    //     setUserData(null); // Clear context state
    // }
}
