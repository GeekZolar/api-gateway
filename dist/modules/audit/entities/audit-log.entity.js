"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuditLog", {
    enumerable: true,
    get: function() {
        return AuditLog;
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
let AuditLog = class AuditLog {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)('uuid', {
        name: 'audit_id'
    }),
    _ts_metadata("design:type", String)
], AuditLog.prototype, "auditId", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'user_id',
        type: 'uuid',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], AuditLog.prototype, "userId", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_userentity.User, (u)=>u.auditLogs, {
        nullable: true
    }),
    (0, _typeorm.JoinColumn)({
        name: 'user_id'
    }),
    _ts_metadata("design:type", Object)
], AuditLog.prototype, "user", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'action',
        type: 'varchar',
        length: 100
    }),
    _ts_metadata("design:type", String)
], AuditLog.prototype, "action", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'entity_type',
        type: 'varchar',
        length: 50
    }),
    _ts_metadata("design:type", String)
], AuditLog.prototype, "entityType", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'entity_id',
        type: 'uuid',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], AuditLog.prototype, "entityId", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'old_values',
        type: 'jsonb',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], AuditLog.prototype, "oldValues", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'new_values',
        type: 'jsonb',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], AuditLog.prototype, "newValues", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'ip_address',
        type: 'varchar',
        length: 45,
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], AuditLog.prototype, "ipAddress", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'user_agent',
        type: 'text',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], AuditLog.prototype, "userAgent", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'status',
        type: 'varchar',
        length: 20
    }),
    _ts_metadata("design:type", String)
], AuditLog.prototype, "status", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'error_message',
        type: 'text',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], AuditLog.prototype, "errorMessage", void 0);
_ts_decorate([
    (0, _typeorm.CreateDateColumn)({
        name: 'created_date'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], AuditLog.prototype, "createdDate", void 0);
AuditLog = _ts_decorate([
    (0, _typeorm.Entity)('audit_logs')
], AuditLog);

//# sourceMappingURL=audit-log.entity.js.map