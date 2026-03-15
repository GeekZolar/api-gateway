"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UpdateRolesDto", {
    enumerable: true,
    get: function() {
        return UpdateRolesDto;
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
const VALID_ROLES = [
    'admin',
    'inventory-manager',
    'po-creator',
    'po-approver',
    'forecast-editor',
    'read-only',
    'user'
];
let UpdateRolesDto = class UpdateRolesDto {
};
_ts_decorate([
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.IsString)({
        each: true
    }),
    (0, _classvalidator.IsIn)(VALID_ROLES, {
        each: true
    }),
    _ts_metadata("design:type", Array)
], UpdateRolesDto.prototype, "roles", void 0);

//# sourceMappingURL=update-roles.dto.js.map