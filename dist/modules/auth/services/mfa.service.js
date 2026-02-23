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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MfaService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const encryption_util_1 = require("../../../utils/encryption.util");
const constants_1 = require("../../../utils/constants");
let MfaService = class MfaService {
    constructor(config) {
        this.config = config;
        this.defaultIssuer = this.config.get('mfaIssuer', 'IMS');
        this.window = this.config.get('mfaWindow', 1);
    }
    generateSecret(options) {
        const { issuer, accountName } = options;
        const secret = speakeasy.generateSecret({
            length: 32,
            otpauth_url: false,
        });
        const label = `${issuer}:${accountName}`;
        const otpauthUrl = speakeasy.otpauthURL({
            secret: secret.base32,
            label,
            issuer,
            encoding: 'base32',
        });
        return {
            secret: secret.base32,
            otpauthUrl,
        };
    }
    async getQrCodeUrl(otpauthUrl) {
        return QRCode.toDataURL(otpauthUrl);
    }
    verifyToken(secret, token) {
        return speakeasy.totp.verify({
            secret,
            encoding: 'base32',
            token,
            window: this.window,
        });
    }
    encryptSecret(secret) {
        return (0, encryption_util_1.encrypt)(secret);
    }
    decryptSecret(encrypted) {
        return (0, encryption_util_1.decrypt)(encrypted);
    }
    generateBackupCodes() {
        const codes = [];
        for (let i = 0; i < constants_1.MFA_BACKUP_CODES_COUNT; i++) {
            codes.push((0, encryption_util_1.generateSecureToken)(4).toUpperCase().replace(/(.{4})/g, '$1-').slice(0, -1));
        }
        return codes;
    }
};
exports.MfaService = MfaService;
exports.MfaService = MfaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MfaService);
//# sourceMappingURL=mfa.service.js.map