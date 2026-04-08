"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Country", {
    enumerable: true,
    get: function() {
        return Country;
    }
});
const _typeorm = require("typeorm");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let Country = class Country {
};
_ts_decorate([
    (0, _typeorm.PrimaryColumn)({
        name: 'country_code',
        type: 'varchar',
        length: 10
    }),
    _ts_metadata("design:type", String)
], Country.prototype, "countryCode", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'country_name',
        type: 'varchar',
        length: 255
    }),
    _ts_metadata("design:type", String)
], Country.prototype, "countryName", void 0);
_ts_decorate([
    (0, _typeorm.CreateDateColumn)({
        name: 'created_at'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], Country.prototype, "createdAt", void 0);
Country = _ts_decorate([
    (0, _typeorm.Entity)({
        name: 'countries',
        schema: 'snadb',
        synchronize: false
    })
], Country);

//# sourceMappingURL=country.entity.js.map