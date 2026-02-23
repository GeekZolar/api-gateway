import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
export interface ServiceRoute {
    path: string;
    target: string;
    authRequired: boolean;
}
export declare class ProxyService {
    private http;
    private config;
    private readonly userServiceUrl;
    private readonly timeout;
    private readonly breakers;
    constructor(http: HttpService, config: ConfigService);
    getBreaker(name: string): {
        fire: (url: string, config: AxiosRequestConfig) => Promise<unknown>;
    };
    forward(serviceName: string, path: string, method: string, headers: Record<string, string>, body?: unknown, query?: string): Promise<unknown>;
    private sanitizeHeaders;
    getServiceUrl(service: string): string;
}
