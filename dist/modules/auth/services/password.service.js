"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PasswordService", {
    enumerable: true,
    get: function() {
        return PasswordService;
    }
});
const _common = require("@nestjs/common");
const _config = require("@nestjs/config");
const _bcrypt = /*#__PURE__*/ _interop_require_wildcard(require("bcrypt"));
const _validatorsutil = require("../../../utils/validators.util");
const _constants = require("../../../utils/constants");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _passwordhistoryentity = require("../../users/entities/password-history.entity");
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
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
let PasswordService = class PasswordService {
    async hash(password) {
        return _bcrypt.hash(password, this.rounds);
    }
    async compare(plain, hash) {
        return _bcrypt.compare(plain, hash);
    }
    validateStrength(password) {
        if (password.length < 8) {
            return {
                valid: false,
                message: 'Password must be at least 8 characters'
            };
        }
        if (!/[a-z]/.test(password)) {
            return {
                valid: false,
                message: 'Password must contain lowercase'
            };
        }
        if (!/[A-Z]/.test(password)) {
            return {
                valid: false,
                message: 'Password must contain uppercase'
            };
        }
        if (!/\d/.test(password)) {
            return {
                valid: false,
                message: 'Password must contain a number'
            };
        }
        if (!/[@$!%*?&]/.test(password)) {
            return {
                valid: false,
                message: 'Password must contain a special character (@$!%*?&)'
            };
        }
        if ((0, _validatorsutil.isCommonPassword)(password)) {
            return {
                valid: false,
                message: 'Password is too common'
            };
        }
        return {
            valid: true
        };
    }
    async isInHistory(userId, newPasswordHash) {
        const recent = await this.passwordHistoryRepo.find({
            where: {
                userId
            },
            order: {
                createdDate: 'DESC'
            },
            take: _constants.PASSWORD_HISTORY_COUNT
        });
        return recent.some((r)=>r.passwordHash === newPasswordHash);
    }
    async addToHistory(userId, passwordHash) {
        await this.passwordHistoryRepo.save(this.passwordHistoryRepo.create({
            userId,
            passwordHash
        }));
        const all = await this.passwordHistoryRepo.find({
            where: {
                userId
            },
            order: {
                createdDate: 'DESC'
            }
        });
        if (all.length > _constants.PASSWORD_HISTORY_COUNT) {
            const toRemove = all.slice(_constants.PASSWORD_HISTORY_COUNT);
            await this.passwordHistoryRepo.remove(toRemove);
        }
    }
    constructor(config, passwordHistoryRepo){
        this.config = config;
        this.passwordHistoryRepo = passwordHistoryRepo;
        this.rounds = this.config.get('bcryptRounds', 12) || 12;
    }
};
PasswordService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(1, (0, _typeorm.InjectRepository)(_passwordhistoryentity.PasswordHistory)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _config.ConfigService === "undefined" ? Object : _config.ConfigService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], PasswordService);

//# sourceMappingURL=password.service.js.map