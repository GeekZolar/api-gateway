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
    get decrypt () {
        return decrypt;
    },
    get encrypt () {
        return encrypt;
    },
    get generateSecureToken () {
        return generateSecureToken;
    },
    get hashToken () {
        return hashToken;
    }
});
const _crypto = /*#__PURE__*/ _interop_require_wildcard(require("crypto"));
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
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;
function getEncryptionKey() {
    const key = process.env.ENCRYPTION_KEY || 'default-encryption-key-change-in-production-32bytes!!';
    return _crypto.createHash('sha256').update(key).digest('hex').slice(0, 32);
}
function encrypt(text) {
    const key = getEncryptionKey();
    const iv = _crypto.randomBytes(IV_LENGTH);
    const cipher = _crypto.createCipheriv(ALGORITHM, Buffer.from(key, 'utf8'), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const tag = cipher.getAuthTag();
    return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted}`;
}
function decrypt(encryptedText) {
    const key = getEncryptionKey();
    const [ivHex, tagHex, encrypted] = encryptedText.split(':');
    if (!ivHex || !tagHex || !encrypted) {
        throw new Error('Invalid encrypted format');
    }
    const iv = Buffer.from(ivHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');
    const decipher = _crypto.createDecipheriv(ALGORITHM, Buffer.from(key, 'utf8'), iv);
    decipher.setAuthTag(tag);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
function hashToken(token) {
    return _crypto.createHash('sha256').update(token).digest('hex');
}
function generateSecureToken(bytes = 32) {
    return _crypto.randomBytes(bytes).toString('hex');
}

//# sourceMappingURL=encryption.util.js.map