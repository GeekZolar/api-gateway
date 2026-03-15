# API Audit – What Exists vs Expected

Base prefix: **`/api/v1`**

---

## ✅ Present in codebase

### Auth (`/auth`)
| Method | Path | Controller | Notes |
|--------|------|------------|--------|
| POST | `/auth/login` | AuthController | ✅ |
| POST | `/auth/refresh` | AuthController | ✅ |
| POST | `/auth/logout` | AuthController | ✅ |
| POST | `/auth/password-reset/request` | AuthController | ✅ |
| POST | `/auth/password-reset/confirm` | AuthController | ✅ |

### Users (`/users`)
| Method | Path | Controller | Notes |
|--------|------|------------|--------|
| POST | `/users` | UsersController | Register ✅ |
| POST | `/users/register` | UsersController | Alias ✅ |
| GET | `/users/me` | UsersController | Current user profile ✅ |
| GET | `/users` | UsersController | List users (Admin) ✅ |
| PATCH | `/users` | UsersController | Update profile ✅ |
| PUT | `/users/:id/roles` | UsersController | Update roles (Admin) ✅ |

### Roles (`/roles`)
| Method | Path | Controller | Notes |
|--------|------|------------|--------|
| GET | `/roles` | RolesController | List (JWT) ✅ |
| GET | `/roles/registration` | RolesController | Public ✅ |

### Health
| Method | Path | Controller | Notes |
|--------|------|------------|--------|
| GET | `/health` | HealthController | ✅ |

### Root
| Method | Path | Controller | Notes |
|--------|------|------------|--------|
| GET | `/` | ProxyController | Service info ✅ |

### Inventory (`/inventory`)
| Method | Path | Controller | Notes |
|--------|------|------------|--------|
| GET | `/inventory` | InventoryController | List with filters ✅ |
| GET | `/inventory/expiring` | InventoryController | Expiring items ✅ |
| GET | `/inventory/:sku` | InventoryController | By SKU ✅ |
| POST | `/inventory/adjust` | InventoryController | Adjustment ✅ |
| POST | `/inventory/transfer` | InventoryController | Transfer ✅ |

### Warehouses (`/warehouses`)
| Method | Path | Controller | Notes |
|--------|------|------------|--------|
| GET | `/warehouses` | WarehousesController | ✅ |
| POST | `/warehouses` | WarehousesController | ✅ |

### Products (`/products`)
| Method | Path | Controller | Notes |
|--------|------|------------|--------|
| GET | `/products` | ProductsController | ✅ |
| POST | `/products` | ProductsController | ✅ |

### Forecasts (`/forecasts`)
| Method | Path | Controller | Notes |
|--------|------|------------|--------|
| GET | `/forecasts/accuracy` | ForecastsController | ✅ |
| POST | `/forecasts/generate` | ForecastsController | ✅ |
| GET | `/forecasts/:sku` | ForecastsController | ✅ |
| PUT | `/forecasts/:sku` | ForecastsController | ✅ |

### Purchase Orders (`/purchase-orders`)
| Method | Path | Controller | Notes |
|--------|------|------------|--------|
| GET | `/purchase-orders` | PurchaseOrdersController | ✅ |
| POST | `/purchase-orders` | PurchaseOrdersController | ✅ |
| PUT | `/purchase-orders/:id/approve` | PurchaseOrdersController | ✅ |
| POST | `/purchase-orders/:id/receive` | PurchaseOrdersController | ✅ |

### Recommendations (`/recommendations`)
| Method | Path | Controller | Notes |
|--------|------|------------|--------|
| GET | `/recommendations/replenishment` | RecommendationsController | ✅ |

### Reports (`/reports`)
| Method | Path | Controller | Notes |
|--------|------|------------|--------|
| GET | `/reports/current-inventory` | ReportsController | ✅ |
| GET | `/reports/valuation` | ReportsController | ✅ |
| GET | `/reports/variance` | ReportsController | ✅ |
| POST | `/reports/export` | ReportsController | ✅ |

### Dashboard (`/dashboard`)
| Method | Path | Controller | Notes |
|--------|------|------------|--------|
| GET | `/dashboard/summary` | DashboardController | ✅ |

### Proxy (fallback)
| Method | Path | Controller | Notes |
|--------|------|------------|--------|
| * | `/auth/login` (proxy) | ProxyController | Only if Auth didn’t handle |
| * | `/auth/refresh` (proxy) | ProxyController | Same |
| * | `/auth/password-reset/*` (proxy) | ProxyController | Same |
| POST | `/users` (proxy) | ProxyController | If not hit by UsersController |
| * | `/roles/registration` (proxy) | ProxyController | Same |
| @All('*') | Catch-all | ProxyController | JWT required, proxy to user-management |

---

## Summary

- **Auth, Users, Roles, Health, Root, Inventory, Warehouses, Products, Forecasts, Purchase Orders, Recommendations, Reports, Dashboard**: all spec’d APIs are present in the codebase.
