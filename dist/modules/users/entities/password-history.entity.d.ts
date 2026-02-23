import { User } from './user.entity';
export declare class PasswordHistory {
    id: string;
    userId: string;
    user: User;
    passwordHash: string;
    createdDate: Date;
}
