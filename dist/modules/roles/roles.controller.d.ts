import { RolesService } from './roles.service';
export declare class RolesController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    listForRegistration(): Promise<{
        roleId: string;
        roleName: string;
    }[]>;
    findAll(): Promise<import("./entities/role.entity").Role[]>;
    findOne(roleId: string): Promise<import("./entities/role.entity").Role>;
}
