"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get buildPermissionKey () {
        return buildPermissionKey;
    },
    get hasPermission () {
        return hasPermission;
    },
    get isCommonPassword () {
        return isCommonPassword;
    }
});
// Common password blocklist (minimal set; extend in production)
const COMMON_PASSWORDS = new Set([
    'password',
    'password1',
    'password123',
    'admin',
    'letmein',
    'welcome',
    'monkey',
    'dragon',
    'master',
    'qwerty',
    'login',
    'abc123',
    '111111',
    'admin123',
    'root',
    'pass',
    'passw0rd',
    'password!',
    'changeme'
]);
function isCommonPassword(password) {
    const lower = password.toLowerCase();
    return COMMON_PASSWORDS.has(lower);
}
function buildPermissionKey(resource, action) {
    return `${resource}.${action}`;
}
function hasPermission(userPermissions, required) {
    const [resource, action] = required.split('.');
    if (!resource || !action) return false;
    const allowed = userPermissions[resource];
    if (!Array.isArray(allowed)) return false;
    return allowed.includes(action);
}

//# sourceMappingURL=validators.util.js.map