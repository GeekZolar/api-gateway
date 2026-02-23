export default () => ({
  throttle: {
    ttl: parseInt(process.env.THROTTLE_TTL || '900000', 10), // 15 min default
    limit: parseInt(process.env.THROTTLE_LIMIT || '100', 10),
    authTtl: parseInt(process.env.AUTH_THROTTLE_TTL || '900000', 10),
    authLimit: parseInt(process.env.AUTH_THROTTLE_LIMIT || '5', 10),
  },
});
