import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { AuthService } from '../auth.service';
interface RefreshPayload {
    sub: string;
    sessionId: string;
    type: 'refresh';
    iat: number;
    exp: number;
}
declare const RefreshTokenStrategy_base: new (...args: any[]) => Strategy;
export declare class RefreshTokenStrategy extends RefreshTokenStrategy_base {
    private config;
    private authService;
    constructor(config: ConfigService, authService: AuthService);
    validate(req: Request, payload: RefreshPayload): Promise<import("../../users/entities/user.entity").User>;
}
export {};
