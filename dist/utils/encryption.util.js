"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encrypt = encrypt;
exports.decrypt = decrypt;
exports.hashToken = hashToken;
exports.generateSecureToken = generateSecureToken;
const crypto = require("crypto");
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;
function getEncryptionKey() {
    const key = process.env.ENCRYPTION_KEY || 'default-encryption-key-change-in-production-32bytes!!';
    return crypto.createHash('sha256').update(key).digest('hex').slice(0, 32);
}
function encrypt(text) {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(key, 'utf8'), iv);
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
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(key, 'utf8'), iv);
    decipher.setAuthTag(tag);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
function hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
}
function generateSecureToken(bytes = 32) {
    return crypto.randomBytes(bytes).toString('hex');
}
//# sourceMappingURL=encryption.util.js.map