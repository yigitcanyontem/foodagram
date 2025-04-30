import {UsersDto} from "../auth/UsersDto.ts";
import {UsersProfileDto} from "./UsersProfileDto.ts";

export interface UsersCompleteDto {
    user: UsersDto;
    profile: UsersProfileDto;
}
