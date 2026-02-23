import { Request, Response } from 'express';
import { ProxyService } from './proxy.service';
export declare class ProxyController {
    private readonly proxy;
    private readonly logger;
    constructor(proxy: ProxyService);
    root(): {
        service: string;
        version: string;
        prefix: string;
        endpoints: {
            health: string;
            auth: {
                login: string;
                refresh: string;
                logout: string;
                passwordReset: string;
            };
            users: string;
            roles: string;
        };
    };
    proxyLogin(req: Request, res: Response): Promise<void>;
    proxyRefresh(req: Request, res: Response): Promise<void>;
    proxyPasswordReset(req: Request, res: Response): Promise<void>;
    proxyUsersRegister(req: Request, res: Response): Promise<void>;
    proxyRolesRegistration(req: Request, res: Response): Promise<void>;
    proxyAll(req: Request, res: Response): Promise<void>;
    private proxyRequest;
}
