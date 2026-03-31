import { User } from '../../users/entities/user.entity';
export declare class Role {
    roleId: string;
    roleName: string;
    roleAlt: string;
    description: string | null;
    permissions: Record<string, string[]>;
    isSystemRole: boolean;
    createdDate: Date;
    updatedDate: Date;
    users: User[];
}
