import {UsersDto} from "@/models/auth/UsersDto";
import {UsersProfileDto} from "@/models/user/UsersProfileDto";

export interface UsersCompleteDto {
    user: UsersDto;
    profile: UsersProfileDto;
}
