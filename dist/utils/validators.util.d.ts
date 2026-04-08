export declare function isCommonPassword(password: string): boolean;
export declare function buildPermissionKey(resource: string, action: string): string;
export declare function hasPermission(userPermissions: Record<string, string[]>, required: string): boolean;
