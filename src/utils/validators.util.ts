// Common password blocklist (minimal set; extend in production)
const COMMON_PASSWORDS = new Set([
  'password', 'password1', 'password123', 'admin', 'letmein', 'welcome',
  'monkey', 'dragon', 'master', 'qwerty', 'login', 'abc123', '111111',
  'admin123', 'root', 'pass', 'passw0rd', 'password!', 'changeme',
]);

export function isCommonPassword(password: string): boolean {
  const lower = password.toLowerCase();
  return COMMON_PASSWORDS.has(lower);
}

export function buildPermissionKey(resource: string, action: string): string {
  return `${resource}.${action}`;
}

export function hasPermission(
  userPermissions: Record<string, string[]>,
  required: string,
): boolean {
  const [resource, action] = required.split('.');
  if (!resource || !action) return false;
  const allowed = userPermissions[resource];
  if (!Array.isArray(allowed)) return false;
  return allowed.includes(action);
}
