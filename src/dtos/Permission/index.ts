export enum PermissionRoles {
    ADMIN = 'ADMIN',
    USER = 'USER'
}

export interface PermissionDTO {
    id?: string;
    role: PermissionRoles;
}