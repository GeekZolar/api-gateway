import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
interface JwtPayload {
    sub: string;
    username: string;
    email: string;
    role: string;
    permissions: Record<string, string[]>;
    sessionId: string;
    iat: number;
    exp: number;
}
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor(config: ConfigService);
    validate(payload: JwtPayload): {
        userId: string;
        username: string;
        email: string;
        role: string;
        permissions: Record<string, string[]>;
        sessionId: string;
    };
}
export {};
