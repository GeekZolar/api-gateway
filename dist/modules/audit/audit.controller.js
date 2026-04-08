"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuditController", {
    enumerable: true,
    get: function() {
        return AuditController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _auditservice = require("./audit.service");
const _auditquerydto = require("./dto/audit-query.dto");
const _jwtauthguard = require("../../common/guards/jwt-auth.guard");
const _permissionsguard = require("../../common/guards/permissions.guard");
const _permissionsdecorator = require("../../common/decorators/permissions.decorator");
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
let AuditController = class AuditController {
    async findAll(query) {
        const startDate = query.startDate ? new Date(query.startDate) : undefined;
        const endDate = query.endDate ? new Date(query.endDate) : undefined;
        return this.auditService.findPaginated({
            userId: query.userId,
            action: query.action,
            entityType: query.entityType,
            startDate,
            endDate,
            page: query.page,
            limit: query.limit
        });
    }
    constructor(auditService){
        this.auditService = auditService;
    }
};
_ts_decorate([
    (0, _common.Get)(),
    (0, _swagger.ApiOperation)({
        summary: 'Query audit logs with filters and pagination'
    }),
    _ts_param(0, (0, _common.Query)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _auditquerydto.AuditQueryDto === "undefined" ? Object : _auditquerydto.AuditQueryDto
    ]),
    _ts_metadata("design:returntype", Promise)
], AuditController.prototype, "findAll", null);
AuditController = _ts_decorate([
    (0, _swagger.ApiTags)('audit-logs'),
    (0, _common.Controller)('audit-logs'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _permissionsguard.PermissionsGuard),
    (0, _permissionsdecorator.RequirePermissions)('auditLogs.read'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _auditservice.AuditService === "undefined" ? Object : _auditservice.AuditService
    ])
], AuditController);

//# sourceMappingURL=audit.controller.js.map