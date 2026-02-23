import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../../../common/interfaces/request-with-user.interface';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor(config: ConfigService);
    validate(payload: JwtPayload & {
        type?: string;
    }): {
        userId: string;
        username: string;
        email: string;
        role: string;
        permissions: Record<string, string[]>;
        sessionId: string;
    };
}
export {};
