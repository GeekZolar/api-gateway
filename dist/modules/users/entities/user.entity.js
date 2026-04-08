"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "User", {
    enumerable: true,
    get: function() {
        return User;
    }
});
const _typeorm = require("typeorm");
const _classtransformer = require("class-transformer");
const _roleentity = require("../../roles/entities/role.entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let User = class User {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)('uuid', {
        name: 'user_id'
    }),
    _ts_metadata("design:type", String)
], User.prototype, "userId", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'username',
        type: 'varchar',
        length: 50,
        unique: true
    }),
    _ts_metadata("design:type", String)
], User.prototype, "username", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'email',
        type: 'varchar',
        length: 255,
        unique: true
    }),
    _ts_metadata("design:type", String)
], User.prototype, "email", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'password_hash',
        type: 'varchar',
        length: 255
    }),
    (0, _classtransformer.Exclude)(),
    _ts_metadata("design:type", String)
], User.prototype, "passwordHash", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'isdefault_password',
        type: 'boolean',
        default: false
    }),
    _ts_metadata("design:type", Boolean)
], User.prototype, "isDefaultPassword", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'first_name',
        type: 'varchar',
        length: 100
    }),
    _ts_metadata("design:type", String)
], User.prototype, "firstName", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'last_name',
        type: 'varchar',
        length: 100
    }),
    _ts_metadata("design:type", String)
], User.prototype, "lastName", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'role_id',
        type: 'uuid'
    }),
    _ts_metadata("design:type", String)
], User.prototype, "roleId", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_roleentity.Role, {
        eager: true
    }),
    (0, _typeorm.JoinColumn)({
        name: 'role_id'
    }),
    _ts_metadata("design:type", typeof _roleentity.Role === "undefined" ? Object : _roleentity.Role)
], User.prototype, "role", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'is_active',
        type: 'boolean',
        default: false
    }),
    _ts_metadata("design:type", Boolean)
], User.prototype, "isActive", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'is_approved',
        type: 'boolean',
        default: false
    }),
    _ts_metadata("design:type", Boolean)
], User.prototype, "isApproved", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'mfa_enabled',
        type: 'boolean',
        default: false
    }),
    _ts_metadata("design:type", Boolean)
], User.prototype, "mfaEnabled", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'mfa_secret',
        type: 'varchar',
        length: 255,
        nullable: true
    }),
    (0, _classtransformer.Exclude)(),
    _ts_metadata("design:type", Object)
], User.prototype, "mfaSecret", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'last_login_date',
        type: 'timestamp',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], User.prototype, "lastLoginDate", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'password_last_changed_date',
        type: 'timestamp',
        default: ()=>'CURRENT_TIMESTAMP'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], User.prototype, "passwordLastChangedDate", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'failed_login_attempts',
        type: 'int',
        default: 0
    }),
    _ts_metadata("design:type", Number)
], User.prototype, "failedLoginAttempts", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'account_locked_until',
        type: 'timestamp',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], User.prototype, "accountLockedUntil", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'created_by',
        type: 'uuid',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], User.prototype, "createdBy", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>User, {
        nullable: true
    }),
    (0, _typeorm.JoinColumn)({
        name: 'created_by'
    }),
    _ts_metadata("design:type", Object)
], User.prototype, "createdByUser", void 0);
_ts_decorate([
    (0, _typeorm.CreateDateColumn)({
        name: 'created_date'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], User.prototype, "createdDate", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'approved_by',
        type: 'uuid',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], User.prototype, "approvedBy", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>User, {
        nullable: true
    }),
    (0, _typeorm.JoinColumn)({
        name: 'approved_by'
    }),
    _ts_metadata("design:type", Object)
], User.prototype, "approvedByUser", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'approved_date',
        type: 'timestamp',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], User.prototype, "approvedDate", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'updated_by',
        type: 'uuid',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], User.prototype, "updatedBy", void 0);
_ts_decorate([
    (0, _typeorm.UpdateDateColumn)({
        name: 'updated_date'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], User.prototype, "updatedDate", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)('UserSession', (s)=>s.user),
    _ts_metadata("design:type", Array)
], User.prototype, "sessions", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)('AuditLog', (a)=>a.user),
    _ts_metadata("design:type", Array)
], User.prototype, "auditLogs", void 0);
User = _ts_decorate([
    (0, _typeorm.Entity)('users')
], User);

//# sourceMappingURL=user.entity.js.map