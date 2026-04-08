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
    get ACCESS_TOKEN_EXPIRY_SECONDS () {
        return ACCESS_TOKEN_EXPIRY_SECONDS;
    },
    get MFA_BACKUP_CODES_COUNT () {
        return MFA_BACKUP_CODES_COUNT;
    },
    get PASSWORD_HISTORY_COUNT () {
        return PASSWORD_HISTORY_COUNT;
    },
    get PASSWORD_RESET_TOKEN_EXPIRY_HOURS () {
        return PASSWORD_RESET_TOKEN_EXPIRY_HOURS;
    },
    get REFRESH_TOKEN_EXPIRY_DAYS () {
        return REFRESH_TOKEN_EXPIRY_DAYS;
    }
});
const PASSWORD_HISTORY_COUNT = 5;
const REFRESH_TOKEN_EXPIRY_DAYS = 7;
const PASSWORD_RESET_TOKEN_EXPIRY_HOURS = 1;
const MFA_BACKUP_CODES_COUNT = 10;
const ACCESS_TOKEN_EXPIRY_SECONDS = 900; // 15 min

//# sourceMappingURL=constants.js.map