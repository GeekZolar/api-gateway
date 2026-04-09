# API Gateway Technical API Documentation

Version: 1.0  
Service: `api-gateway`  
Base path: `/api/v1`  
Swagger UI: `/docs` (when enabled)

## 1) Overview

This document describes the implemented API surface of the gateway, including:
- Endpoint contracts (method, path, auth, role requirements).
- Request validation rules based on DTOs and global validation pipe.
- Response patterns and common error behavior.
- Runtime and operational details that affect consumers.

The gateway exposes both domain APIs (auth, users, inventory, etc.) and fallback proxy routes.

## 2) Runtime and Cross-Cutting Behavior

### 2.1 Global Prefix and Docs
- Global API prefix is configured as `/api/v1`.
- Swagger endpoints are mounted at:
  - `GET /docs`
  - `GET /docs-json`
- Swagger is skipped only when `SWAGGER_DISABLED=true`.

### 2.2 Global Validation
Global `ValidationPipe` is enabled with:
- `whitelist: true`: strips unknown properties.
- `forbidNonWhitelisted: true`: rejects payloads containing unknown properties.

Practical impact:
- Clients must send only fields defined by DTOs.
- Invalid payloads return `400 Bad Request`.

### 2.3 Security
- JWT authentication is enforced by `JwtAuthGuard` on protected routes.
- Role authorization is enforced by `RolesGuard` + `@Roles(...)` on role-scoped routes.
- Swagger bearer auth is documented for protected endpoints.

### 2.4 Rate Limiting
- Login endpoint: `5 requests / 900000 ms` (15 min).
- Password reset request endpoint: `3 requests / 900000 ms`.
- Additional global throttling is configured in app module.

### 2.5 CORS and Headers
- CORS is enabled with credentials.
- Allowed headers include `Authorization` and `X-Correlation-ID`.

## 3) Authentication and Authorization Model

### 3.1 Auth Types
- **Public**: no JWT required.
- **JWT**: valid bearer token required.
- **JWT + Roles**: valid bearer token and allowed role(s) required.

### 3.2 Role Catalog
- `admin`
- `inventory-manager`
- `po-creator`
- `po-approver`
- `forecast-editor`
- `read-only`
- `user`

## 4) API Modules and Endpoints

All paths below are relative to `/api/v1`.

## 4.1 Root and Health

### GET `/`
- Auth: Public
- Purpose: Service metadata and endpoint hints.
- Response: `{ service, version, prefix, endpoints }`

### GET `/health`
- Auth: Public
- Purpose: Liveness/status check.
- Response:
  - `status`: `"ok"`
  - `service`: `"api-gateway"`
  - `timestamp`: ISO datetime

## 4.2 Auth APIs (`/auth`)

### POST `/auth/login`
- Auth: Public
- Rate limit: 5 / 15 min
- Body:
  - `username` (string, required)
  - `password` (string, required, min length 1)
- Success `200`: returns access and refresh tokens.
- Errors:
  - `400` validation failure
  - `401` invalid credentials
  - `429` throttled

### POST `/auth/refresh`
- Auth: Public
- Body:
  - `refreshToken` (string, required, min length 1)
- Success `200`: returns new access token.
- Errors: `400`, `401`

### POST `/auth/logout`
- Auth: Public (controller-level)
- Success `200`: logout acknowledgement.

### POST `/auth/password-reset/request`
- Auth: Public
- Rate limit: 3 / 15 min
- Body:
  - `email` (valid email, required)
- Success `200`: reset flow initiated.
- Errors: `400`, `429`

### POST `/auth/password-reset/confirm`
- Auth: Public
- Body:
  - `token` (string, required, min length 1)
  - `newPassword` (string, required, 8-128 chars, must contain upper/lower/number)
- Success `200`: password reset confirmed.
- Errors: `400` invalid input/token

## 4.3 Users APIs (`/users`)

### POST `/users`
- Auth: Public
- Purpose: Register new user.
- Body:
  - `email` (valid email)
  - `username` (3-32 chars, regex `^[a-zA-Z0-9_-]+$`)
  - `password` (8-128 chars, upper/lower/number required)
- Success `201`: user created.
- Errors: `400`, `409` duplicate email/username.

### POST `/users/register`
- Auth: Public
- Purpose: Alias for `POST /users`.
- Body/response/errors: same as above.

### GET `/users/me`
- Auth: JWT
- Purpose: Current user profile.
- Success `200`.
- Errors: `401`.

### GET `/users`
- Auth: JWT + role `admin`
- Query:
  - `page` (optional, default 1)
  - `pageSize` (optional, default 20)
- Success `200`: paginated users.
- Errors: `401`, `403`.

### PATCH `/users`
- Auth: JWT
- Purpose: Update own profile.
- Body (optional fields):
  - `email` (valid email)
  - `username` (same constraints as create)
- Success `200`.
- Errors: `400`, `401`.

### PUT `/users/:id/roles`
- Auth: JWT + role `admin`
- Body:
  - `roles` (array of strings; each must be one of valid role catalog)
- Success `200`.
- Errors: `400`, `403`, `404`.

## 4.4 Roles APIs (`/roles`)

### GET `/roles`
- Auth: JWT
- Purpose: List all roles.
- Success `200`: static role list.

### GET `/roles/registration`
- Auth: Public
- Purpose: Public role options for signup UX.
- Success `200`: static role list.

## 4.5 Inventory APIs (`/inventory`)

Role groups used:
- **Read roles**: `admin`, `inventory-manager`, `po-creator`, `po-approver`, `forecast-editor`, `read-only`, `user`
- **Edit roles**: `admin`, `inventory-manager`

### GET `/inventory`
- Auth: JWT + read roles
- Query DTO:
  - `sku` (string, optional)
  - `warehouseId` (uuid, optional)
  - `status` (`available | quarantine | damaged | expired`, optional)
  - `lotNumber` (string, optional)
  - `page` (int, 1..500, default 1)
  - `pageSize` (int, 1..100, default 20)
- Success `200`: paginated inventory list.

### GET `/inventory/expiring`
- Auth: JWT + read roles
- Query:
  - `days` (int, 1..365, default 120)
  - `warehouseId` (uuid, optional)
- Success `200`.

### GET `/inventory/:sku`
- Auth: JWT + read roles
- Success `200`.
- Errors: `404` SKU not found.

### POST `/inventory/adjust`
- Auth: JWT + edit roles
- Body:
  - `productId` (uuid, required)
  - `warehouseId` (uuid, required)
  - `lotNumber` (string, optional)
  - `expiryDate` (ISO date, optional)
  - `quantityDelta` (number, required)
  - `reason` (`cycle_count | damage | expiry | found | other`)
- Success `200`: adjustment applied.
- Errors: `400`, `403`.

### POST `/inventory/transfer`
- Auth: JWT + edit roles
- Body:
  - `fromWarehouseId` (uuid, required)
  - `toWarehouseId` (uuid, required)
  - `requestedDate` (ISO date, optional)
  - `lines` (array, required), each line:
    - `productId` (uuid, required)
    - `requestedQty` (number, required)
    - `expiryDate` (ISO date, optional)
- Success `201`: transfer created.
- Errors: `400`, `403`.

## 4.6 Warehouses APIs (`/warehouses`)

### GET `/warehouses`
- Auth: JWT + inventory read roles
- Success `200`.

### POST `/warehouses`
- Auth: JWT + roles `admin | inventory-manager`
- Body:
  - `code` (string, 1..50, required)
  - `name` (string, required)
  - `country` (string, optional)
  - `state` (string, optional)
  - `city` (string, optional)
  - `isActive` (boolean, optional)
- Success `201`.
- Errors: `400`, `409`.

## 4.7 Products APIs (`/products`)

### GET `/products`
- Auth: JWT + inventory read roles
- Success `200`.

### POST `/products`
- Auth: JWT + roles `admin | inventory-manager`
- Body:
  - `sku` (string, 1..100, required)
  - `name` (string, required)
  - `description` (string, optional)
  - `uom` (string, max 20, optional)
  - `status` (`active | discontinued`, optional)
- Success `201`.
- Errors: `400`, `409`.

## 4.8 Forecasts APIs (`/forecasts`)

Role groups:
- **Read**: `admin`, `inventory-manager`, `forecast-editor`
- **Edit**: `admin`, `forecast-editor`

### GET `/forecasts/accuracy`
- Auth: JWT + edit roles
- Query:
  - `from` (ISO date, required)
  - `to` (ISO date, required)
  - `sku` (string, optional)
  - `warehouseId` (uuid, optional)
- Success `200`.

### POST `/forecasts/generate`
- Auth: JWT + edit roles
- Body:
  - `warehouseIds` (uuid v4[], optional)
  - `skuList` (string[], optional)
  - `horizonDays` (int, 1..365, default 180)
- Success `200`: generation job started.

### GET `/forecasts/:sku`
- Auth: JWT + read roles
- Query:
  - `warehouseId` (uuid, optional)
  - `from` (ISO date, optional)
  - `to` (ISO date, optional)
- Success `200`.
- Errors: `404`.

### PUT `/forecasts/:sku`
- Auth: JWT + edit roles
- Body:
  - `warehouseId` (uuid, optional)
  - `periodStart` (ISO date, required)
  - `periodEnd` (ISO date, required)
  - `overrideQty` (number, required)
- Success `200`.
- Errors: `400`, `404`.

## 4.9 Purchase Orders APIs (`/purchase-orders`)

Role groups:
- **List**: `admin`, `inventory-manager`, `po-creator`, `po-approver`
- **Create**: `admin`, `inventory-manager`, `po-creator`
- **Approve**: `admin`, `po-approver`
- **Receive**: `admin`, `inventory-manager`

### GET `/purchase-orders`
- Auth: JWT + list roles
- Query:
  - `supplierId` (uuid, optional)
  - `warehouseId` (uuid, optional)
  - `status` (`draft | pending_approval | approved | received | cancelled`, optional)
  - `fromDate` (ISO date, optional)
  - `toDate` (ISO date, optional)
  - `page` (int, 1..500, default 1)
  - `pageSize` (int, 1..100, default 20)
- Success `200`.

### POST `/purchase-orders`
- Auth: JWT + create roles
- Body:
  - `supplierId` (uuid, required)
  - `warehouseId` (uuid, required)
  - `expectedDate` (ISO date, required)
  - `lines` (array, required), each line:
    - `productId` (uuid, optional)
    - `sku` (string, optional)
    - `orderedQty` (number, required)
    - `unitCost` (number, optional)
- Success `201`.

### PUT `/purchase-orders/:id/approve`
- Auth: JWT + approve roles
- Body:
  - `comment` (string, optional)
- Success `200`.

### POST `/purchase-orders/:id/receive`
- Auth: JWT + receive roles
- Body:
  - `receiptDate` (ISO date, required)
  - `lines` (array, required), each line:
    - `poLineId` (uuid, required)
    - `receivedQty` (number, required)
    - `lotNumber` (string, optional)
    - `expiryDate` (ISO date, optional)
- Success `200`.

## 4.10 Recommendations APIs (`/recommendations`)

### GET `/recommendations/replenishment`
- Auth: JWT + roles `admin | inventory-manager | forecast-editor`
- Query:
  - `warehouseId` (uuid, optional)
  - `sku` (string, optional)
- Success `200`: replenishment recommendations.

## 4.11 Reports APIs (`/reports`)

Allowed roles:
- `admin`, `inventory-manager`, `po-creator`, `po-approver`, `forecast-editor`, `read-only`, `user`

### GET `/reports/current-inventory`
- Auth: JWT + allowed roles
- Success `200`.

### GET `/reports/valuation`
- Auth: JWT + allowed roles
- Success `200`.

### GET `/reports/variance`
- Auth: JWT + allowed roles
- Success `200`.

### POST `/reports/export`
- Auth: JWT + allowed roles
- Body:
  - `type` (`current-inventory | valuation | variance | custom`, required)
  - `format` (`xlsx | pdf | csv`, required)
  - `filters` (object, optional)
- Success `200`: export job queued/result stub.

## 4.12 Dashboard APIs (`/dashboard`)

### GET `/dashboard/summary`
- Auth: JWT + same roles as reports
- Success `200`: KPI summary payload.

## 5) Proxy and Fallback Routing

The gateway contains explicit proxy handlers in addition to concrete controllers.

### 5.1 Explicit Proxy Routes
- `ALL /auth/login`
- `ALL /auth/refresh`
- `ALL /auth/password-reset/request`
- `ALL /auth/password-reset/confirm`
- `POST /users`
- `ALL /roles/registration`

### 5.2 Catch-All Proxy
- `ALL *` with JWT required.
- Forwards requests to `user-management` service under `/api/v1`.
- Adds/propagates `X-Correlation-ID`.
- On upstream failure returns:
  - `502 Bad Gateway`
  - `{ statusCode, message, correlationId }`

Note: when a concrete controller route matches first, it handles request locally; otherwise proxy path may apply.

## 6) Common Error Semantics

Typical status codes used:
- `200` success.
- `201` created.
- `400` validation/contract errors.
- `401` missing or invalid authentication.
- `403` role forbidden.
- `404` resource not found.
- `409` uniqueness conflict.
- `429` throttled.
- `502` downstream proxy failure.

## 7) Request/Response Conventions

- Content type: `application/json`.
- Auth header on protected routes:
  - `Authorization: Bearer <jwt>`
- Correlation header:
  - `X-Correlation-ID` supported and propagated through proxy layer.
- Pagination convention:
  - `page`, `pageSize` query parameters.

## 8) Environment Flags Relevant to API Consumers

- `API_PREFIX` -> API base prefix (default `/api/v1`).
- `SWAGGER_DISABLED=true` -> disables Swagger generation/setup.
- `ALLOWED_ORIGINS` -> CORS origins.

## 9) Quick Verification Checklist

1. Start service and confirm:
   - `GET /api/v1/health` returns 200.
2. Confirm docs:
   - `GET /docs` loads Swagger UI.
3. Verify auth flow:
   - login -> refresh.
4. Verify protected endpoint:
   - `GET /api/v1/users/me` with token.
5. Verify role-protected endpoint:
   - `GET /api/v1/users` with admin token only.

