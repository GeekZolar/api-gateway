"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UserQueryDto", {
    enumerable: true,
    get: function() {
        return UserQueryDto;
    }
});
const _classvalidator = require("class-validator");
const _classtransformer = require("class-transformer");
const _swagger = require("@nestjs/swagger");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let UserQueryDto = class UserQueryDto {
    constructor(){
        this.page = 1;
        this.limit = 20;
        this.sortBy = 'createdDate';
        this.sortOrder = 'DESC';
    }
};
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Number)
], UserQueryDto.prototype, "page", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Number)
], UserQueryDto.prototype, "limit", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], UserQueryDto.prototype, "search", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], UserQueryDto.prototype, "role", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)(),
    (0, _classvalidator.IsOptional)(),
    (0, _classtransformer.Type)(()=>Boolean),
    _ts_metadata("design:type", Boolean)
], UserQueryDto.prototype, "isActive", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        enum: [
            'createdDate',
            'username',
            'email',
            'lastLoginDate'
        ]
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsIn)([
        'createdDate',
        'username',
        'email',
        'lastLoginDate'
    ]),
    _ts_metadata("design:type", String)
], UserQueryDto.prototype, "sortBy", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        enum: [
            'ASC',
            'DESC'
        ]
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsIn)([
        'ASC',
        'DESC'
    ]),
    _ts_metadata("design:type", String)
], UserQueryDto.prototype, "sortOrder", void 0);

//# sourceMappingURL=user-query.dto.js.map