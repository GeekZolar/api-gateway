import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
export declare const ValidationPipeConfig: {
    whitelist: boolean;
    forbidNonWhitelisted: boolean;
    transform: boolean;
    transformOptions: {
        enableImplicitConversion: boolean;
    };
};
export declare class CustomValidationPipe implements PipeTransform<unknown> {
    transform(value: unknown, { metatype }: ArgumentMetadata): Promise<any>;
    private toValidate;
}
