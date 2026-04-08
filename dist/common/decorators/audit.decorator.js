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
    get AUDIT_KEY () {
        return AUDIT_KEY;
    },
    get Audit () {
        return Audit;
    }
});
const _common = require("@nestjs/common");
const AUDIT_KEY = 'audit';
const Audit = (options)=>(0, _common.SetMetadata)(AUDIT_KEY, options);

//# sourceMappingURL=audit.decorator.js.map