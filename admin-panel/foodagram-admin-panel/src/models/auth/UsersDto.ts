import {Role} from "./Role.ts";

export type UsersDto = {
    id: string;
    username: string;
    email: string;
    password: string;
    role: Role;
    enabled: boolean;
    createdDate: Date;
};
