"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UserSession", {
    enumerable: true,
    get: function() {
        return UserSession;
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
let UserSession = class UserSession {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)('uuid', {
        name: 'session_id'
    }),
    _ts_metadata("design:type", String)
], UserSession.prototype, "sessionId", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'user_id',
        type: 'uuid'
    }),
    _ts_metadata("design:type", String)
], UserSession.prototype, "userId", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_userentity.User, (u)=>u.sessions, {
        onDelete: 'CASCADE'
    }),
    (0, _typeorm.JoinColumn)({
        name: 'user_id'
    }),
    _ts_metadata("design:type", typeof _userentity.User === "undefined" ? Object : _userentity.User)
], UserSession.prototype, "user", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'refresh_token_hash',
        type: 'varchar',
        length: 255
    }),
    _ts_metadata("design:type", String)
], UserSession.prototype, "refreshTokenHash", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'ip_address',
        type: 'varchar',
        length: 45,
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], UserSession.prototype, "ipAddress", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'user_agent',
        type: 'text',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], UserSession.prototype, "userAgent", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'is_active',
        type: 'boolean',
        default: true
    }),
    _ts_metadata("design:type", Boolean)
], UserSession.prototype, "isActive", void 0);
_ts_decorate([
    (0, _typeorm.CreateDateColumn)({
        name: 'created_date'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], UserSession.prototype, "createdDate", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'expires_at',
        type: 'timestamp'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], UserSession.prototype, "expiresAt", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'last_activity',
        type: 'timestamp',
        default: ()=>'CURRENT_TIMESTAMP'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], UserSession.prototype, "lastActivity", void 0);
UserSession = _ts_decorate([
    (0, _typeorm.Entity)('user_sessions')
], UserSession);

//# sourceMappingURL=session.entity.js.map