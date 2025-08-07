import { PermissionRoles } from "../Permission";

export interface UserDTO {
    id?: string;
    name: string;
    email: string;
    password: string;
}

export interface RegularUserDTO extends UserDTO {}

export interface AdminUserDTO extends UserDTO {
    role: PermissionRoles;
}