import { Injectable, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosRequestConfig } from 'axios';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const CircuitBreaker = require('opossum');

export interface ServiceRoute {
  path: string;
  target: string;
  authRequired: boolean;
}

@Injectable()
export class ProxyService {
  private readonly userServiceUrl: string;
  private readonly timeout: number;
  private readonly breakers: Map<string, { fire: (url: string, config: AxiosRequestConfig) => Promise<unknown> }> = new Map();

  constructor(
    @Inject(HttpService) private http: HttpService,
    @Inject(ConfigService) private config: ConfigService,
  ) {
    this.userServiceUrl = this.config.get<string>('userServiceUrl', 'http://localhost:3002');
    this.timeout = this.config.get<number>('requestTimeout', 30000);
  }

  getBreaker(name: string) {
    if (!this.breakers.has(name)) {
      const threshold = this.config.get<number>('circuitBreakerThreshold', 5);
      const breaker = new CircuitBreaker(
        async (url: string, config: AxiosRequestConfig) => {
          const res = await firstValueFrom(
            this.http.request({
              ...config,
              url,
              timeout: this.timeout,
              validateStatus: () => true,
            }),
          );
          if (res.status >= 500) throw new Error(`Upstream ${res.status}`);
          return res;
        },
        {
          timeout: this.timeout,
          errorThresholdPercentage: 50,
          volumeThreshold: threshold,
          resetTimeout: 30000,
        },
      );
      breaker.on('open', () => console.warn(`[Gateway] Circuit open: ${name}`));
      breaker.fallback(() => ({
        data: { message: 'Service temporarily unavailable', statusCode: 503 },
        status: 503,
        statusText: 'Service Unavailable',
        headers: {},
        config: {},
      }));
      this.breakers.set(name, breaker);
    }
    return this.breakers.get(name)!;
  }

  async forward(
    serviceName: string,
    path: string,
    method: string,
    headers: Record<string, string>,
    body?: unknown,
    query?: string,
  ) {
    const baseUrl = this.userServiceUrl;
    const url = `${baseUrl.replace(/\/$/, '')}${path}${query ? `?${query}` : ''}`;

    const config: AxiosRequestConfig = {
      method: method as any,
      headers: this.sanitizeHeaders(headers),
      data: body,
    };

    const breaker = this.getBreaker(serviceName);
    const response = await breaker.fire(url, config);
    return response;
  }

  private sanitizeHeaders(headers: Record<string, string>): Record<string, string> {
    const allowed = ['content-type', 'authorization', 'accept', 'x-correlation-id'];
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(headers)) {
      const lower = k.toLowerCase();
      if (allowed.includes(lower) && typeof v === 'string') {
        out[k] = v;
      }
    }
    return out;
  }

  getServiceUrl(service: string): string {
    if (service === 'user-management') return this.userServiceUrl;
    return this.userServiceUrl;
  }
}
