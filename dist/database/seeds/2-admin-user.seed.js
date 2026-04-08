"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "seedAdminUser", {
    enumerable: true,
    get: function() {
        return seedAdminUser;
    }
});
const _bcrypt = /*#__PURE__*/ _interop_require_wildcard(require("bcrypt"));
const _userentity = require("../../modules/users/entities/user.entity");
const _roleentity = require("../../modules/roles/entities/role.entity");
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
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@ChangeMe123!';
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '12', 10);
async function seedAdminUser(dataSource) {
    const userRepo = dataSource.getRepository(_userentity.User);
    const roleRepo = dataSource.getRepository(_roleentity.Role);
    const existing = await userRepo.findOne({
        where: {
            username: ADMIN_USERNAME
        }
    });
    if (existing) {
        console.log('Admin user already exists');
        return;
    }
    const adminRole = await roleRepo.findOne({
        where: {
            roleName: 'System Administrator'
        }
    });
    if (!adminRole) {
        throw new Error('System Administrator role not found. Run roles seed first.');
    }
    const passwordHash = await _bcrypt.hash(ADMIN_PASSWORD, BCRYPT_ROUNDS);
    await userRepo.save(userRepo.create({
        username: ADMIN_USERNAME,
        email: ADMIN_EMAIL,
        passwordHash,
        firstName: 'System',
        lastName: 'Administrator',
        roleId: adminRole.roleId,
        isActive: true,
        isApproved: true
    }));
    console.log(`Admin user created: ${ADMIN_USERNAME}`);
}

//# sourceMappingURL=2-admin-user.seed.js.map