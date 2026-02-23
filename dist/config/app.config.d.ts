declare const _default: () => {
    port: number;
    nodeEnv: string;
    apiPrefix: string;
    allowedOrigins: string;
    bcryptRounds: number;
    accountLockoutAttempts: number;
    accountLockoutDuration: number;
    sessionTimeout: number;
    maxConcurrentSessions: number;
    mfaIssuer: string;
    mfaWindow: number;
    mfaIncludeQrCode: string | boolean;
};
export default _default;
