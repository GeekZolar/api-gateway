"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PasswordResetConfirmDto", {
    enumerable: true,
    get: function() {
        return PasswordResetConfirmDto;
    }
});
const _classvalidator = require("class-validator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let PasswordResetConfirmDto = class PasswordResetConfirmDto {
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.MinLength)(1, {
        message: 'Token is required'
    }),
    _ts_metadata("design:type", String)
], PasswordResetConfirmDto.prototype, "token", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.MinLength)(8, {
        message: 'Password must be at least 8 characters'
    }),
    (0, _classvalidator.MaxLength)(128),
    (0, _classvalidator.Matches)(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: 'Password must contain at least one uppercase, one lowercase and one number'
    }),
    _ts_metadata("design:type", String)
], PasswordResetConfirmDto.prototype, "newPassword", void 0);

//# sourceMappingURL=password-reset-confirm.dto.js.map