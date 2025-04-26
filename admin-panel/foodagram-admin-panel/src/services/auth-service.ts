import axios from 'axios';
import { GlobalConstants } from '../utils/GlobalConstants';
import {AuthenticationRequest} from "../models/auth/AuthenticationRequest.ts";
import { AuthenticationResponse } from '../models/auth/AuthenticationResponse.ts';

export class AuthService {
    static baseUrl: string = GlobalConstants.baseUrl + 'auth';

    static authenticate(request: AuthenticationRequest): Promise<AuthenticationResponse> {
        return axios.post(`${this.baseUrl}/login`, request)
            .then(response => {
                this.setSessionStorage(response.data);
                return response.data;
            })
            .catch(error => {
                console.error('Login failed:', error);
                throw error;
            });
    }

    static logout() {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('email');
        sessionStorage.removeItem('username');
    }

    static setSessionStorage(authenticationResponse: AuthenticationResponse) {
        sessionStorage.setItem('token', authenticationResponse.accessToken);
        sessionStorage.setItem('email', authenticationResponse.user.email);
        sessionStorage.setItem('username', authenticationResponse.user.username);

        const refreshToken = authenticationResponse.refreshToken;
        document.cookie = `refreshToken=${encodeURIComponent(refreshToken)}; path=/api/refresh-token; Secure; HttpOnly; SameSite=Lax`;
    }

    static isAuthenticated(): boolean {
        return sessionStorage.getItem('token') !== null;
    }

    static getUserData(): { username: string | null, email: string | null, token: string | null } {
        const username = sessionStorage.getItem('username');
        const email = sessionStorage.getItem('email');
        const token = sessionStorage.getItem('token');
        return { username, email, token };
    }
}
