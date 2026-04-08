"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PasswordHistory", {
    enumerable: true,
    get: function() {
        return PasswordHistory;
    }
});
const _typeorm = require("typeorm");
const _userentity = require("./user.entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let PasswordHistory = class PasswordHistory {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)('uuid', {
        name: 'id'
    }),
    _ts_metadata("design:type", String)
], PasswordHistory.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'user_id',
        type: 'uuid'
    }),
    _ts_metadata("design:type", String)
], PasswordHistory.prototype, "userId", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_userentity.User, {
        onDelete: 'CASCADE'
    }),
    (0, _typeorm.JoinColumn)({
        name: 'user_id'
    }),
    _ts_metadata("design:type", typeof _userentity.User === "undefined" ? Object : _userentity.User)
], PasswordHistory.prototype, "user", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'password_hash',
        type: 'varchar',
        length: 255
    }),
    _ts_metadata("design:type", String)
], PasswordHistory.prototype, "passwordHash", void 0);
_ts_decorate([
    (0, _typeorm.CreateDateColumn)({
        name: 'created_date'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], PasswordHistory.prototype, "createdDate", void 0);
PasswordHistory = _ts_decorate([
    (0, _typeorm.Entity)('password_history')
], PasswordHistory);

//# sourceMappingURL=password-history.entity.js.map