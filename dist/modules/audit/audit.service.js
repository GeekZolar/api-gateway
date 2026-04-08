"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuditService", {
    enumerable: true,
    get: function() {
        return AuditService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _auditlogentity = require("./entities/audit-log.entity");
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
let AuditService = class AuditService {
    async log(input) {
        const log = this.auditRepo.create({
            userId: input.userId ?? null,
            action: input.action,
            entityType: input.entityType,
            entityId: input.entityId ?? null,
            oldValues: input.oldValues ?? null,
            newValues: input.newValues ?? null,
            ipAddress: input.ipAddress ?? null,
            userAgent: input.userAgent ?? null,
            status: input.status,
            errorMessage: input.errorMessage ?? null
        });
        return this.auditRepo.save(log);
    }
    async findPaginated(params) {
        const { userId, action, entityType, startDate, endDate, page = 1, limit = 50 } = params;
        const qb = this.auditRepo.createQueryBuilder('a').leftJoinAndSelect('a.user', 'u').orderBy('a.createdDate', 'DESC');
        if (userId) qb.andWhere('a.userId = :userId', {
            userId
        });
        if (action) qb.andWhere('a.action = :action', {
            action
        });
        if (entityType) qb.andWhere('a.entityType = :entityType', {
            entityType
        });
        if (startDate) qb.andWhere('a.createdDate >= :startDate', {
            startDate
        });
        if (endDate) qb.andWhere('a.createdDate <= :endDate', {
            endDate
        });
        const total = await qb.getCount();
        const data = await qb.skip((page - 1) * limit).take(limit).getMany();
        return {
            data,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }
    constructor(auditRepo){
        this.auditRepo = auditRepo;
    }
};
AuditService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_auditlogentity.AuditLog)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], AuditService);

//# sourceMappingURL=audit.service.js.map