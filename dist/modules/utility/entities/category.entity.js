"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Category", {
    enumerable: true,
    get: function() {
        return Category;
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
let Category = class Category {
};
_ts_decorate([
    (0, _typeorm.PrimaryColumn)({
        name: 'category_id',
        type: 'int'
    }),
    _ts_metadata("design:type", Number)
], Category.prototype, "categoryId", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'category_name',
        type: 'varchar',
        length: 255
    }),
    _ts_metadata("design:type", String)
], Category.prototype, "categoryName", void 0);
_ts_decorate([
    (0, _typeorm.CreateDateColumn)({
        name: 'created_at'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], Category.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'modified_date',
        type: 'timestamptz',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], Category.prototype, "modifiedDate", void 0);
Category = _ts_decorate([
    (0, _typeorm.Entity)({
        name: 'categories',
        schema: 'snadb',
        synchronize: false
    })
], Category);

//# sourceMappingURL=category.entity.js.map