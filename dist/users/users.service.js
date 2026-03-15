"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UsersService", {
    enumerable: true,
    get: function() {
        return UsersService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _bcrypt = /*#__PURE__*/ _interop_require_wildcard(require("bcrypt"));
const _userentity = require("./entities/user.entity");
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
let UsersService = class UsersService {
    async create(dto) {
        const existingEmail = await this.userRepository.findOne({
            where: {
                email: dto.email
            }
        });
        if (existingEmail) {
            throw new _common.ConflictException('Email already registered');
        }
        const existingUsername = await this.userRepository.findOne({
            where: {
                username: dto.username
            }
        });
        if (existingUsername) {
            throw new _common.ConflictException('Username already taken');
        }
        const passwordHash = await _bcrypt.hash(dto.password, this.saltRounds);
        const user = this.userRepository.create({
            email: dto.email,
            username: dto.username,
            passwordHash,
            role: 'user'
        });
        const saved = await this.userRepository.save(user);
        const { passwordHash: _, ...result } = saved;
        return result;
    }
    async findByEmail(email) {
        return this.userRepository.findOne({
            where: {
                email
            }
        });
    }
    async findByUsername(username) {
        return this.userRepository.findOne({
            where: {
                username
            }
        });
    }
    async findById(id) {
        return this.userRepository.findOne({
            where: {
                id
            }
        });
    }
    async updatePassword(userId, passwordHash) {
        await this.userRepository.update(userId, {
            passwordHash
        });
    }
    async getProfile(userId) {
        const user = await this.findById(userId);
        if (!user) throw new _common.NotFoundException('User not found');
        const { passwordHash: _, ...result } = user;
        return result;
    }
    async updateProfile(userId, dto) {
        const user = await this.findById(userId);
        if (!user) throw new _common.NotFoundException('User not found');
        if (dto.email !== undefined && dto.email !== user.email) {
            const existing = await this.findByEmail(dto.email);
            if (existing) throw new _common.ConflictException('Email already in use');
        }
        if (dto.username !== undefined && dto.username !== user.username) {
            const existing = await this.findByUsername(dto.username);
            if (existing) throw new _common.ConflictException('Username already taken');
        }
        if (dto.email !== undefined) user.email = dto.email;
        if (dto.username !== undefined) user.username = dto.username;
        const saved = await this.userRepository.save(user);
        const { passwordHash: _, ...result } = saved;
        return result;
    }
    async list(page = 1, pageSize = 20) {
        const [items, total] = await this.userRepository.findAndCount({
            skip: (page - 1) * pageSize,
            take: pageSize,
            order: {
                createdAt: 'DESC'
            }
        });
        const safe = items.map((u)=>{
            const { passwordHash: _, ...rest } = u;
            return rest;
        });
        return {
            items: safe,
            total,
            page,
            pageSize
        };
    }
    async updateRoles(userId, roles) {
        const user = await this.findById(userId);
        if (!user) throw new _common.NotFoundException('User not found');
        const role = roles?.[0] ?? user.role;
        user.role = role;
        const saved = await this.userRepository.save(user);
        const { passwordHash: _, ...result } = saved;
        return result;
    }
    constructor(userRepository){
        this.userRepository = userRepository;
        this.saltRounds = 10;
    }
};
UsersService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_userentity.User)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], UsersService);

//# sourceMappingURL=users.service.js.map