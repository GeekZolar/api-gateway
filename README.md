# IMS Backends – API Gateway & User Management

Production-ready **API Gateway** and **User Management** microservices built with NestJS 10+.

## Repository structure

- **`api-gateway/`** – Single entry point: reverse proxy, JWT validation, rate limiting, circuit breaker, CORS.
- **`user-management/`** – Auth (login, MFA, password reset), users CRUD, RBAC, sessions, audit logs.

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- (Optional) Redis for distributed rate limiting

## Quick start

### 1. User Management Service

```bash
cd user-management
cp .env.example .env
# Edit .env: set DB_*, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, etc.

npm install
npm run migration:run    # Run TypeORM migrations
npm run seed:run         # Seed roles + admin user
npm run start:dev
```

- API: `http://localhost:3001/api/v1`
- Swagger: `http://localhost:3001/api/docs`
- Health: `http://localhost:3001/api/v1/health`

Default admin (after seed): username `admin`, password `Admin@ChangeMe123!` (change in production).

### 2. API Gateway

```bash
cd api-gateway
cp .env.example .env
# Set JWT_ACCESS_SECRET to match user-management, USER_SERVICE_URL=http://localhost:3001

npm install
npm run start:dev
```

- Gateway: `http://localhost:3000/api/v1`
- Health: `http://localhost:3000/api/v1/health`

All client requests go to the gateway; it forwards to the User Management service (and other microservices when added).

## Environment variables

### User Management (`user-management/.env`)

See `user-management/.env.example`. Main ones:

- **JWT_ACCESS_SECRET**, **JWT_REFRESH_SECRET** – Min 32 characters; keep in sync with the gateway.
- **DB_HOST**, **DB_PORT**, **DB_USERNAME**, **DB_PASSWORD**, **DB_DATABASE** – PostgreSQL.
- **DB_SYNCHRONIZE** – Must be `false` in production.
- **BCRYPT_ROUNDS** – 12 recommended.
- **ACCOUNT_LOCKOUT_ATTEMPTS** / **ACCOUNT_LOCKOUT_DURATION** – Lockout after failed logins.

### API Gateway (`api-gateway/.env`)

See `api-gateway/.env.example`. Main ones:

- **JWT_ACCESS_SECRET** – Same as User Management (to validate JWTs).
- **USER_SERVICE_URL** – User Management base URL (e.g. `http://localhost:3001`).
- **THROTTLE_LIMIT** / **THROTTLE_TTL** – Global rate limit.

## API overview

### Authentication (via Gateway or directly to User Management)

- `POST /api/v1/auth/login` – Login (optional `mfaCode` if MFA enabled).
- `POST /api/v1/auth/refresh` – Body: `{ "refreshToken": "..." }`.
- `POST /api/v1/auth/logout` – Bearer token required.
- `POST /api/v1/auth/mfa/setup` – Start MFA setup.
- `POST /api/v1/auth/mfa/verify` – Enable MFA with code.
- `POST /api/v1/auth/password-reset/request` – Body: `{ "email": "..." }`.
- `POST /api/v1/auth/password-reset/confirm` – Body: `{ "token": "...", "newPassword": "..." }`.
- `GET /api/v1/auth/sessions` – List sessions.
- `DELETE /api/v1/auth/sessions/:sessionId` – Revoke session.

### Users

- `POST /api/v1/users` – Register (no auth).
- `GET /api/v1/users` – List (paginated; requires `users.read`).
- `GET /api/v1/users/:userId` – Get one (requires `users.read`).
- `PATCH /api/v1/users/:userId` – Update (requires `users.update`).
- `PATCH /api/v1/users/:userId/approve` – Approve (requires `users.approve`).
- `PATCH /api/v1/users/:userId/status` – Activate/deactivate (requires `users.update`).
- `POST /api/v1/users/change-password` – Change own password (Bearer required).

### Roles

- `GET /api/v1/roles/registration` – Public list for registration dropdown.
- `GET /api/v1/roles` – List all (requires `roles.read`).
- `GET /api/v1/roles/:roleId` – Get one (requires `roles.read`).

### Audit

- `GET /api/v1/audit-logs` – Query logs (requires `auditLogs.read`).

## Database migrations (User Management)

```bash
cd user-management
npm run migration:run
npm run migration:revert  # if needed
```

## Testing

```bash
cd user-management
npm test
npm run test:e2e
```

## Deployment notes

- Run migrations before starting the app; never use `DB_SYNCHRONIZE=true` in production.
- Use strong, rotated secrets for JWT and encryption.
- Set **ALLOWED_ORIGINS** and CORS correctly for your frontend.
- Prefer HTTPS and put the gateway behind a load balancer.
- Use Redis for throttler storage when running multiple instances.

## License

Proprietary / as per your project.
