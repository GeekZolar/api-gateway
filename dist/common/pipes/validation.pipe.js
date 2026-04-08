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
    get CustomValidationPipe () {
        return CustomValidationPipe;
    },
    get ValidationPipeConfig () {
        return ValidationPipeConfig;
    }
});
const _common = require("@nestjs/common");
const _classvalidator = require("class-validator");
const _classtransformer = require("class-transformer");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
const ValidationPipeConfig = {
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
        enableImplicitConversion: true
    }
};
let CustomValidationPipe = class CustomValidationPipe {
    async transform(value, { metatype }) {
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
        const object = (0, _classtransformer.plainToInstance)(metatype, value, {
            enableImplicitConversion: true
        });
        const errors = await (0, _classvalidator.validate)(object);
        if (errors.length > 0) {
            const messages = errors.flatMap((e)=>Object.values(e.constraints || {}));
            throw new _common.BadRequestException({
                message: 'Validation failed',
                errors: messages
            });
        }
        return object;
    }
    toValidate(metatype) {
        const types = [
            String,
            Boolean,
            Number,
            Array,
            Object
        ];
        return !types.includes(metatype);
    }
};
CustomValidationPipe = _ts_decorate([
    (0, _common.Injectable)()
], CustomValidationPipe);

//# sourceMappingURL=validation.pipe.js.map