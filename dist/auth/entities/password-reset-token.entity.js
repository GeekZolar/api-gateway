"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PasswordResetToken", {
    enumerable: true,
    get: function() {
        return PasswordResetToken;
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
let PasswordResetToken = class PasswordResetToken {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)('uuid'),
    _ts_metadata("design:type", String)
], PasswordResetToken.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'user_id',
        type: 'uuid'
    }),
    _ts_metadata("design:type", String)
], PasswordResetToken.prototype, "userId", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_userentity.User, {
        onDelete: 'CASCADE'
    }),
    (0, _typeorm.JoinColumn)({
        name: 'user_id'
    }),
    _ts_metadata("design:type", typeof _userentity.User === "undefined" ? Object : _userentity.User)
], PasswordResetToken.prototype, "user", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar',
        unique: true
    }),
    _ts_metadata("design:type", String)
], PasswordResetToken.prototype, "token", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'expires_at',
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], PasswordResetToken.prototype, "expiresAt", void 0);
_ts_decorate([
    (0, _typeorm.CreateDateColumn)({
        name: 'created_at'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], PasswordResetToken.prototype, "createdAt", void 0);
PasswordResetToken = _ts_decorate([
    (0, _typeorm.Entity)('password_reset_tokens')
], PasswordResetToken);

//# sourceMappingURL=password-reset-token.entity.js.map