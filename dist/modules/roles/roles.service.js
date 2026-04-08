"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RolesService", {
    enumerable: true,
    get: function() {
        return RolesService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _roleentity = require("./entities/role.entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let RolesService = class RolesService {
    async findAll() {
        return this.roleRepo.find({
            order: {
                roleName: 'ASC'
            }
        });
    }
    async findOne(roleId) {
        const role = await this.roleRepo.findOne({
            where: {
                roleId
            }
        });
        if (!role) throw new _common.NotFoundException('Role not found');
        return role;
    }
    async findByRoleName(roleName) {
        return this.roleRepo.findOne({
            where: {
                roleName
            }
        });
    }
    async findForRegistration() {
        const roles = await this.roleRepo.find({
            //where: { roleName: Not('System Administrator') },
            select: [
                'roleId',
                'roleName',
                'roleAlt'
            ],
            order: {
                roleName: 'ASC'
            }
        });
        return roles;
    }
    async validateRoleId(roleId) {
        const role = await this.roleRepo.findOne({
            where: {
                roleId
            }
        });
        return !!role;
    }
    constructor(roleRepo){
        this.roleRepo = roleRepo;
    }
};
RolesService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_roleentity.Role)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], RolesService);

//# sourceMappingURL=roles.service.js.map