"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ReportsService", {
    enumerable: true,
    get: function() {
        return ReportsService;
    }
});
const _common = require("@nestjs/common");
const _inventoryservice = require("../inventory/inventory.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ReportsService = class ReportsService {
    async getCurrentInventory() {
        const result = await this.inventoryService.list({
            page: 1,
            pageSize: 1000
        }, undefined);
        return {
            generatedAt: new Date().toISOString(),
            summary: {
                totalRecords: result.total,
                page: result.page,
                pageSize: result.pageSize
            },
            data: result.data
        };
    }
    async getValuation() {
        const result = await this.inventoryService.list({
            page: 1,
            pageSize: 1000
        }, undefined);
        const withValue = result.data.map((row)=>({
                ...row,
                unitCost: 0,
                totalValue: 0
            }));
        return {
            generatedAt: new Date().toISOString(),
            summary: {
                totalRecords: result.total
            },
            data: withValue
        };
    }
    async getVariance() {
        return {
            generatedAt: new Date().toISOString(),
            summary: {
                totalVarianceCount: 0,
                totalVarianceValue: 0
            },
            data: [],
            message: 'Variance report (book vs physical). Implement with cycle count data.'
        };
    }
    async exportReport(type, format, _filters) {
        return {
            type,
            format,
            status: 'queued',
            message: 'Export job queued. Implement with background job and file storage.',
            downloadUrl: null
        };
    }
    async getDashboardSummary() {
        const inv = await this.inventoryService.list({
            page: 1,
            pageSize: 1
        }, undefined);
        return {
            stockouts: 0,
            turnoverRate: 0,
            totalValuation: 0,
            alerts: [],
            inventoryRecordCount: inv.total,
            generatedAt: new Date().toISOString()
        };
    }
    constructor(inventoryService){
        this.inventoryService = inventoryService;
    }
};
ReportsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _inventoryservice.InventoryService === "undefined" ? Object : _inventoryservice.InventoryService
    ])
], ReportsService);

//# sourceMappingURL=reports.service.js.map