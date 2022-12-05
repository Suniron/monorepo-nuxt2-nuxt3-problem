import { Group } from "./group";

export interface BaseUser {
    user_id: string;
    username: string;
}

export type Role = "admin" | "user";

export interface User {
        "id": string,
        "username": string,
        "firstName": string, 
        "lastName": string,
        "email": string,
        "roles": Role[],
        "groups": Group[]
}