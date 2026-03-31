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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcrypt");
const validators_util_1 = require("../../../utils/validators.util");
const constants_1 = require("../../../utils/constants");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const password_history_entity_1 = require("../../users/entities/password-history.entity");
let PasswordService = class PasswordService {
    constructor(config, passwordHistoryRepo) {
        this.config = config;
        this.passwordHistoryRepo = passwordHistoryRepo;
        this.rounds = this.config.get('bcryptRounds', 12) || 12;
    }
    async hash(password) {
        return bcrypt.hash(password, this.rounds);
    }
    async compare(plain, hash) {
        return bcrypt.compare(plain, hash);
    }
    validateStrength(password) {
        if (password.length < 8) {
            return { valid: false, message: 'Password must be at least 8 characters' };
        }
        if (!/[a-z]/.test(password)) {
            return { valid: false, message: 'Password must contain lowercase' };
        }
        if (!/[A-Z]/.test(password)) {
            return { valid: false, message: 'Password must contain uppercase' };
        }
        if (!/\d/.test(password)) {
            return { valid: false, message: 'Password must contain a number' };
        }
        if (!/[@$!%*?&]/.test(password)) {
            return { valid: false, message: 'Password must contain a special character (@$!%*?&)' };
        }
        if ((0, validators_util_1.isCommonPassword)(password)) {
            return { valid: false, message: 'Password is too common' };
        }
        return { valid: true };
    }
    async isInHistory(userId, newPasswordHash) {
        const recent = await this.passwordHistoryRepo.find({
            where: { userId },
            order: { createdDate: 'DESC' },
            take: constants_1.PASSWORD_HISTORY_COUNT,
        });
        return recent.some((r) => r.passwordHash === newPasswordHash);
    }
    async addToHistory(userId, passwordHash) {
        await this.passwordHistoryRepo.save(this.passwordHistoryRepo.create({ userId, passwordHash }));
        const all = await this.passwordHistoryRepo.find({
            where: { userId },
            order: { createdDate: 'DESC' },
        });
        if (all.length > constants_1.PASSWORD_HISTORY_COUNT) {
            const toRemove = all.slice(constants_1.PASSWORD_HISTORY_COUNT);
            await this.passwordHistoryRepo.remove(toRemove);
        }
    }
};
exports.PasswordService = PasswordService;
exports.PasswordService = PasswordService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(password_history_entity_1.PasswordHistory)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        typeorm_2.Repository])
], PasswordService);
//# sourceMappingURL=password.service.js.map