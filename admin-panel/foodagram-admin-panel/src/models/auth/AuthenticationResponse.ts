import {UsersDto} from "@/models/auth/UsersDto";

export type AuthenticationResponse = {
    accessToken: string;
    refreshToken: string;
    id: string;
    user: UsersDto;
};
