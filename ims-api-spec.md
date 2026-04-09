## IMS API Specification (Sable & Rosenfeld)

Version: 0.1 (draft)  
Base URL convention: `/api/v1`

This document lists all core APIs for the Inventory Management System (IMS), grouped by domain. It is derived from `tech-doc` and adjusted for consistency.

---

## 1. Inventory Management APIs

### 1.1 List Inventory

- **Method**: GET  
- **Path**: `/api/v1/inventory`  
- **Auth**: JWT (Inventory Manager, Admin, Read-Only)  
- **Description**: Retrieve inventory levels by SKU and warehouse.
- **Query Params (optional)**:
  - `sku`: string
  - `warehouseId`: uuid
  - `status`: `available | quarantine | damaged | expired`
  - `lotNumber`: string
  - `page`: number
  - `pageSize`: number

### 1.2 Get Inventory by SKU

- **Method**: GET  
- **Path**: `/api/v1/inventory/{sku}`  
- **Auth**: JWT  
- **Description**: Get detailed inventory for a single SKU across warehouses (including lots/expiry).

### 1.3 Create Inventory Adjustment

- **Method**: POST  
- **Path**: `/api/v1/inventory/adjust`  
- **Auth**: JWT (Inventory Manager, Admin)  
- **Description**: Create an inventory adjustment (e.g. cycle count, damaged, found).
- **Body (suggested)**:
  - `productId` (uuid) or `sku` (string)
  - `warehouseId` (uuid)
  - `lotNumber` (string, optional)
  - `expiryDate` (ISO date, optional)
  - `quantityDelta` (number, positive or negative)
  - `reason` (string enum: `cycle_count`, `damage`, `expiry`, `other`)

### 1.4 Get Expiring Inventory

- **Method**: GET  
- **Path**: `/api/v1/inventory/expiring`  
- **Auth**: JWT  
- **Description**: Get inventory expiring within a given window (e.g. 4 months).
- **Query Params**:
  - `days`: number (default 120)
  - `warehouseId`: uuid (optional)

### 1.5 Create Transfer

- **Method**: POST  
- **Path**: `/api/v1/inventory/transfer`  
- **Auth**: JWT (Inventory Manager, Admin)  
- **Description**: Create a stock transfer between warehouses.
- **Body (suggested)**:
  - `fromWarehouseId` (uuid)
  - `toWarehouseId` (uuid)
  - `lines`: array of:
    - `productId` (uuid) or `sku` (string)
    - `requestedQty` (number)
    - `lotNumber` / `expiryDate` (optional)

---

## 2. Forecasting & Demand Planning APIs

### 2.1 Get Forecast for SKU

- **Method**: GET  
- **Path**: `/api/v1/forecasts/{sku}`  
- **Auth**: JWT (Forecast Editor, Admin, Inventory Manager)  
- **Description**: Get forecast for a SKU, optionally by warehouse and horizon.
- **Query Params (optional)**:
  - `warehouseId`: uuid
  - `from`: ISO date
  - `to`: ISO date

### 2.2 Generate Forecasts

- **Method**: POST  
- **Path**: `/api/v1/forecasts/generate`  
- **Auth**: JWT (Forecast Editor, Admin)  
- **Description**: Trigger forecast generation job.
- **Body (optional)**:
  - `warehouseIds`: uuid[] (if omitted, all)
  - `skuList`: string[] (if omitted, all)
  - `horizonDays`: number (e.g. 180)

### 2.3 Override Forecast

- **Method**: PUT  
- **Path**: `/api/v1/forecasts/{sku}`  
- **Auth**: JWT (Forecast Editor, Admin)  
- **Description**: Override forecast for given SKU (and optional warehouse/period).
- **Body**:
  - `warehouseId` (uuid, optional)
  - `periodStart` (ISO date)
  - `periodEnd` (ISO date)
  - `overrideQty` (number)

### 2.4 Forecast Accuracy

- **Method**: GET  
- **Path**: `/api/v1/forecasts/accuracy`  
- **Auth**: JWT (Forecast Editor, Admin)  
- **Description**: Return forecast accuracy metrics across SKUs/warehouses.
- **Query Params**:
  - `from`: ISO date
  - `to`: ISO date
  - `sku` / `warehouseId` (optional filters)

---

## 3. Purchase Order Management APIs

### 3.1 List Purchase Orders

- **Method**: GET  
- **Path**: `/api/v1/purchase-orders`  
- **Auth**: JWT (PO Creator, PO Approver, Inventory Manager, Admin)  
- **Query Params (optional)**:
  - `supplierId`: uuid
  - `warehouseId`: uuid
  - `status`: `draft | pending_approval | approved | received | cancelled`
  - `fromDate`, `toDate`: ISO dates

### 3.2 Create Purchase Order

- **Method**: POST  
- **Path**: `/api/v1/purchase-orders`  
- **Auth**: JWT (PO Creator, Inventory Manager, Admin)  
- **Body (suggested)**:
  - `supplierId` (uuid)
  - `warehouseId` (uuid)
  - `expectedDate` (ISO date)
  - `lines`: array of:
    - `productId` (uuid) or `sku` (string)
    - `orderedQty` (number)
    - `unitCost` (number)

### 3.3 Approve Purchase Order

- **Method**: PUT  
- **Path**: `/api/v1/purchase-orders/{id}/approve`  
- **Auth**: JWT (PO Approver, Admin)  
- **Body (optional)**:
  - `comment`: string

### 3.4 Record PO Receipt

- **Method**: POST  
- **Path**: `/api/v1/purchase-orders/{id}/receive`  
- **Auth**: JWT (Inventory Manager, Admin)  
- **Description**: Record goods receipt for a PO.
- **Body (suggested)**:
  - `receiptDate` (ISO date)
  - `lines`: array of:
    - `poLineId` (uuid)
    - `receivedQty` (number)
    - `lotNumber` (string, optional)
    - `expiryDate` (ISO date, optional)

### 3.5 Get Replenishment Recommendations

- **Method**: GET  
- **Path**: `/api/v1/recommendations/replenishment`  
- **Auth**: JWT (Inventory Manager, Forecast Editor, Admin)  
- **Query Params**:
  - `warehouseId`: uuid (optional)
  - `sku`: string (optional)

---

## 4. Reporting & Analytics APIs

### 4.1 Current Inventory Report

- **Method**: GET  
- **Path**: `/api/v1/reports/current-inventory`  
- **Auth**: JWT (Read-Only and above)  
- **Description**: Snapshot of inventory levels, aggregated.

### 4.2 Inventory Valuation Report

- **Method**: GET  
- **Path**: `/api/v1/reports/valuation`  
- **Auth**: JWT  
- **Description**: Inventory valuation by SKU/warehouse.

### 4.3 Reconciliation Variance Report

- **Method**: GET  
- **Path**: `/api/v1/reports/variance`  
- **Auth**: JWT  
- **Description**: Variance between book and physical counts.

### 4.4 Dashboard Summary

- **Method**: GET  
- **Path**: `/api/v1/dashboard/summary`  
- **Auth**: JWT  
- **Description**: KPIs for main dashboard (stockouts, turns, value, alerts).

### 4.5 Export Report

- **Method**: POST  
- **Path**: `/api/v1/reports/export`  
- **Auth**: JWT  
- **Body (suggested)**:
  - `type`: `current-inventory | valuation | variance | custom`
  - `format`: `xlsx | pdf | csv`
  - `filters`: object (report-specific)

---

## 5. User Management & Auth APIs

These are partly implemented already in the gateway; here we define the target contract.

### 5.1 Login

- **Method**: POST  
- **Path**: `/api/v1/auth/login`  
- **Auth**: Public  
- **Body**:
  - `username`: string
  - `password`: string
- **Response**:
  - `accessToken`: string (JWT)
  - `refreshToken`: string (JWT)

### 5.2 Refresh Access Token

- **Method**: POST  
- **Path**: `/api/v1/auth/refresh`  
- **Auth**: Public (token body)  
- **Body**:
  - `refreshToken`: string

### 5.3 Logout

- **Method**: POST  
- **Path**: `/api/v1/auth/logout`  
- **Auth**: JWT or just client-side (stateless)  
- **Description**: Client discards tokens; optional server-side session revocation.

### 5.4 Password Reset Request

- **Method**: POST  
- **Path**: `/api/v1/auth/password-reset/request`  
- **Auth**: Public  
- **Body**:
  - `email`: string

### 5.5 Password Reset Confirm

- **Method**: POST  
- **Path**: `/api/v1/auth/password-reset/confirm`  
- **Auth**: Public (via emailed token)  
- **Body**:
  - `token`: string
  - `newPassword`: string

### 5.6 List Users

- **Method**: GET  
- **Path**: `/api/v1/users`  
- **Auth**: JWT (Admin)  
- **Description**: List users (for admin UI).

### 5.7 Create User

- **Method**: POST  
- **Path**: `/api/v1/users`  
- **Auth**: JWT (Admin)  
- **Body (suggested)**:
  - `email`: string
  - `username`: string
  - `password`: string
  - `roles`: string[]

### 5.8 Update User Roles

- **Method**: PUT  
- **Path**: `/api/v1/users/{id}/roles`  
- **Auth**: JWT (Admin)  
- **Body**:
  - `roles`: string[]

### 5.9 Get Current User Profile

- **Method**: GET  
- **Path**: `/api/v1/users/me`  
- **Auth**: JWT  
- **Description**: Return the profile of the currently authenticated user.

---

## 6. Integration Gateway APIs (external systems)

These are high-level patterns; concrete paths may be refined when integrating each system.

### 6.1 Webhooks (from Channels/WMS to IMS)

- **Method**: POST  
- **Path examples**:
  - `/api/v1/webhooks/shopify/orders`
  - `/api/v1/webhooks/amazon/orders`
  - `/api/v1/webhooks/faire/orders`
  - `/api/v1/webhooks/wms/extensiv/inventory`
- **Auth**: Shared secret / HMAC signature per integration.

### 6.2 QuickBooks Sync Triggers

- **Method**: POST  
- **Paths (examples)**:
  - `/api/v1/integrations/quickbooks/sync/inventory`
  - `/api/v1/integrations/quickbooks/sync/purchase-orders`
  - `/api/v1/integrations/quickbooks/sync/valuation`
- **Auth**: JWT (Admin/system).

### 6.3 WMS Sync Endpoints

- **Method**: POST / GET  
- **Paths (examples)**:
  - `/api/v1/integrations/extensiv/sync/inventory`
  - `/api/v1/integrations/diamond/sync/inventory`

---

## 7. Conventions & Cross-Cutting Concerns

- **Versioning**: All endpoints under `/api/v1`.
- **Auth**: JWT Bearer for internal users; API keys / HMAC for external webhooks.
- **Pagination**: Standard `page` and `pageSize` for list endpoints.
- **Filtering**: Query parameters for simple filters; request body for complex report filters.
- **Error format** (suggested):
  - `statusCode`: number
  - `message`: string or string[]
  - `error`: string (e.g. `Bad Request`, `Unauthorized`)

