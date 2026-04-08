"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Role", {
    enumerable: true,
    get: function() {
        return Role;
    }
});
const _typeorm = require("typeorm");
const _userentity = require("../../users/entities/user.entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let Role = class Role {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)('uuid', {
        name: 'role_id'
    }),
    _ts_metadata("design:type", String)
], Role.prototype, "roleId", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'role_name',
        type: 'varchar',
        length: 100,
        unique: true
    }),
    _ts_metadata("design:type", String)
], Role.prototype, "roleName", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'role_alt',
        type: 'varchar',
        length: 50,
        unique: true
    }),
    _ts_metadata("design:type", String)
], Role.prototype, "roleAlt", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'description',
        type: 'text',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], Role.prototype, "description", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'permissions',
        type: 'jsonb'
    }),
    _ts_metadata("design:type", typeof Record === "undefined" ? Object : Record)
], Role.prototype, "permissions", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'is_system_role',
        type: 'boolean',
        default: false
    }),
    _ts_metadata("design:type", Boolean)
], Role.prototype, "isSystemRole", void 0);
_ts_decorate([
    (0, _typeorm.CreateDateColumn)({
        name: 'created_date'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], Role.prototype, "createdDate", void 0);
_ts_decorate([
    (0, _typeorm.UpdateDateColumn)({
        name: 'updated_date'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], Role.prototype, "updatedDate", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)(()=>_userentity.User, (u)=>u.role),
    _ts_metadata("design:type", Array)
], Role.prototype, "users", void 0);
Role = _ts_decorate([
    (0, _typeorm.Entity)('roles')
], Role);

//# sourceMappingURL=role.entity.js.map