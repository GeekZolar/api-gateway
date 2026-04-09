export default () => ({
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  apiPrefix: process.env.API_PREFIX || 'api/v1',
  allowedOrigins: process.env.ALLOWED_ORIGINS || 'http://localhost:3000',
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
  accountLockoutAttempts: parseInt(process.env.ACCOUNT_LOCKOUT_ATTEMPTS || '5', 10),
  accountLockoutDuration: parseInt(process.env.ACCOUNT_LOCKOUT_DURATION || '1800000', 10),
  sessionTimeout: parseInt(process.env.SESSION_TIMEOUT || '1800000', 10),
  maxConcurrentSessions: parseInt(process.env.MAX_CONCURRENT_SESSIONS || '3', 10),
  mfaIssuer: process.env.MFA_ISSUER || 'S&R IMS',
  mfaWindow: parseInt(process.env.MFA_WINDOW || '1', 10),
  mfaIncludeQrCode:
    process.env.MFA_INCLUDE_QR_CODE === undefined
      ? true
      : ['true', '1', 'yes', 'y'].includes(process.env.MFA_INCLUDE_QR_CODE.toLowerCase()),
});
