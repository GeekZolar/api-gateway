"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuditInterceptor", {
    enumerable: true,
    get: function() {
        return AuditInterceptor;
    }
});
const _common = require("@nestjs/common");
const _operators = require("rxjs/operators");
const _core = require("@nestjs/core");
const _auditdecorator = require("../decorators/audit.decorator");
const _auditservice = require("../../modules/audit/audit.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let AuditInterceptor = class AuditInterceptor {
    intercept(context, next) {
        const auditOpts = this.reflector.get(_auditdecorator.AUDIT_KEY, context.getHandler());
        if (!auditOpts) return next.handle();
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const entityId = auditOpts.entityIdParam ? request.params?.[auditOpts.entityIdParam] : request.params?.id;
        return next.handle().pipe((0, _operators.tap)(async (response)=>{
            await this.auditService.log({
                userId: user?.userId,
                action: auditOpts.action,
                entityType: auditOpts.entityType,
                entityId: entityId || undefined,
                oldValues: request.oldValues,
                newValues: response,
                ipAddress: request.ip,
                userAgent: request.headers['user-agent'],
                status: 'SUCCESS'
            });
        }), (0, _operators.catchError)(async (error)=>{
            await this.auditService.log({
                userId: user?.userId,
                action: auditOpts.action,
                entityType: auditOpts.entityType,
                entityId: entityId || undefined,
                status: 'FAILED',
                errorMessage: error?.message,
                ipAddress: request.ip,
                userAgent: request.headers['user-agent']
            });
            throw error;
        }));
    }
    constructor(auditService, reflector){
        this.auditService = auditService;
        this.reflector = reflector;
    }
};
AuditInterceptor = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _auditservice.AuditService === "undefined" ? Object : _auditservice.AuditService,
        typeof _core.Reflector === "undefined" ? Object : _core.Reflector
    ])
], AuditInterceptor);

//# sourceMappingURL=audit.interceptor.js.map