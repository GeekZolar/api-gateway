declare const _default: () => {
    port: number;
    apiPrefix: string;
    allowedOrigins: string;
    jwtSecret: string | undefined;
    throttleTtl: number;
    throttleLimit: number;
    authThrottleLimit: number;
    userServiceUrl: string;
    requestTimeout: number;
    circuitBreakerThreshold: number;
};
export default _default;
