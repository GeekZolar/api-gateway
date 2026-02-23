import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
export declare class RolesService {
    private roleRepo;
    constructor(roleRepo: Repository<Role>);
    findAll(): Promise<Role[]>;
    findOne(roleId: string): Promise<Role>;
    findByRoleName(roleName: string): Promise<Role | null>;
    findForRegistration(): Promise<{
        roleId: string;
        roleName: string;
    }[]>;
    validateRoleId(roleId: string): Promise<boolean>;
}
