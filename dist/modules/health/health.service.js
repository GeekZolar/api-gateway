"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "HealthService", {
    enumerable: true,
    get: function() {
        return HealthService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
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
let HealthService = class HealthService {
    async check() {
        let dbStatus = 'down';
        try {
            await this.dataSource.query('SELECT 1');
            dbStatus = 'up';
        } catch  {
        // leave dbStatus as 'down'
        }
        return {
            status: dbStatus === 'up' ? 'ok' : 'degraded',
            database: dbStatus,
            timestamp: new Date().toISOString()
        };
    }
    constructor(dataSource){
        this.dataSource = dataSource;
    }
};
HealthService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectDataSource)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.DataSource === "undefined" ? Object : _typeorm1.DataSource
    ])
], HealthService);

//# sourceMappingURL=health.service.js.map