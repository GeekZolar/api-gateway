"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const core_1 = require("@nestjs/core");
const audit_decorator_1 = require("../decorators/audit.decorator");
const audit_service_1 = require("../../modules/audit/audit.service");
let AuditInterceptor = class AuditInterceptor {
    constructor(auditService, reflector) {
        this.auditService = auditService;
        this.reflector = reflector;
    }
    intercept(context, next) {
        const auditOpts = this.reflector.get(audit_decorator_1.AUDIT_KEY, context.getHandler());
        if (!auditOpts)
            return next.handle();
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const entityId = auditOpts.entityIdParam
            ? request.params?.[auditOpts.entityIdParam]
            : request.params?.id;
        return next.handle().pipe((0, operators_1.tap)(async (response) => {
            await this.auditService.log({
                userId: user?.userId,
                action: auditOpts.action,
                entityType: auditOpts.entityType,
                entityId: entityId || undefined,
                oldValues: request.oldValues,
                newValues: response,
                ipAddress: request.ip,
                userAgent: request.headers['user-agent'],
                status: 'SUCCESS',
            });
        }), (0, operators_1.catchError)(async (error) => {
            await this.auditService.log({
                userId: user?.userId,
                action: auditOpts.action,
                entityType: auditOpts.entityType,
                entityId: entityId || undefined,
                status: 'FAILED',
                errorMessage: error?.message,
                ipAddress: request.ip,
                userAgent: request.headers['user-agent'],
            });
            throw error;
        }));
    }
};
exports.AuditInterceptor = AuditInterceptor;
exports.AuditInterceptor = AuditInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [audit_service_1.AuditService,
        core_1.Reflector])
], AuditInterceptor);
//# sourceMappingURL=audit.interceptor.js.map