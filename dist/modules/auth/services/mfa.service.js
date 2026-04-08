"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MfaService", {
    enumerable: true,
    get: function() {
        return MfaService;
    }
});
const _common = require("@nestjs/common");
const _config = require("@nestjs/config");
const _speakeasy = /*#__PURE__*/ _interop_require_wildcard(require("speakeasy"));
const _qrcode = /*#__PURE__*/ _interop_require_wildcard(require("qrcode"));
const _encryptionutil = require("../../../utils/encryption.util");
const _constants = require("../../../utils/constants");
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
let MfaService = class MfaService {
    /**
   * Generate a TOTP secret and otpauth URL for Google/Microsoft Authenticator.
   * Uses issuer and accountName so the app shows the correct label and issuer.
   */ generateSecret(options) {
        const { issuer, accountName } = options;
        const secret = _speakeasy.generateSecret({
            length: 32,
            otpauth_url: false
        });
        const label = `${issuer}:${accountName}`;
        const otpauthUrl = _speakeasy.otpauthURL({
            secret: secret.base32,
            label,
            issuer,
            encoding: 'base32'
        });
        return {
            secret: secret.base32,
            otpauthUrl
        };
    }
    async getQrCodeUrl(otpauthUrl) {
        return _qrcode.toDataURL(otpauthUrl);
    }
    verifyToken(secret, token) {
        return _speakeasy.totp.verify({
            secret,
            encoding: 'base32',
            token,
            window: this.window
        });
    }
    encryptSecret(secret) {
        return (0, _encryptionutil.encrypt)(secret);
    }
    decryptSecret(encrypted) {
        return (0, _encryptionutil.decrypt)(encrypted);
    }
    generateBackupCodes() {
        const codes = [];
        for(let i = 0; i < _constants.MFA_BACKUP_CODES_COUNT; i++){
            codes.push((0, _encryptionutil.generateSecureToken)(4).toUpperCase().replace(/(.{4})/g, '$1-').slice(0, -1));
        }
        return codes;
    }
    constructor(config){
        this.config = config;
        this.defaultIssuer = this.config.get('mfaIssuer', 'IMS');
        this.window = this.config.get('mfaWindow', 1);
    }
};
MfaService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _config.ConfigService === "undefined" ? Object : _config.ConfigService
    ])
], MfaService);

//# sourceMappingURL=mfa.service.js.map