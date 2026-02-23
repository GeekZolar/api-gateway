import { DataSource } from 'typeorm';
import { Role } from '../../modules/roles/entities/role.entity';

const PREDEFINED_ROLES = [
  {
    roleName: 'System Administrator',
    description: 'Full system access with all permissions',
    permissions: {
      users: ['create', 'read', 'update', 'delete', 'approve'],
      roles: ['create', 'read', 'update', 'delete'],
      inventory: ['create', 'read', 'update', 'delete'],
      purchaseOrders: ['create', 'read', 'update', 'delete', 'approve'],
      forecasts: ['create', 'read', 'update', 'delete'],
      auditLogs: ['read'],
    },
    isSystemRole: true,
  },
  {
    roleName: 'Inventory Manager',
    description: 'Manage inventory items and stock levels',
    permissions: {
      users: ['read'],
      inventory: ['create', 'read', 'update', 'delete'],
      purchaseOrders: ['read'],
      forecasts: ['read'],
    },
    isSystemRole: true,
  },
  {
    roleName: 'PO Creator',
    description: 'Create and edit purchase orders',
    permissions: {
      users: ['read'],
      inventory: ['read'],
      purchaseOrders: ['create', 'read', 'update'],
      forecasts: ['read'],
    },
    isSystemRole: true,
  },
  {
    roleName: 'PO Approver',
    description: 'Approve purchase orders',
    permissions: {
      users: ['read'],
      inventory: ['read'],
      purchaseOrders: ['read', 'approve'],
      forecasts: ['read'],
    },
    isSystemRole: true,
  },
  {
    roleName: 'Forecast Editor',
    description: 'Edit demand forecasts',
    permissions: {
      users: ['read'],
      inventory: ['read'],
      purchaseOrders: ['read'],
      forecasts: ['create', 'read', 'update', 'delete'],
    },
    isSystemRole: true,
  },
  {
    roleName: 'Read-Only User',
    description: 'View-only access to all modules',
    permissions: {
      users: ['read'],
      inventory: ['read'],
      purchaseOrders: ['read'],
      forecasts: ['read'],
    },
    isSystemRole: true,
  },
];

export async function seedRoles(dataSource: DataSource): Promise<void> {
  const repo = dataSource.getRepository(Role);
  for (const r of PREDEFINED_ROLES) {
    const existing = await repo.findOne({ where: { roleName: r.roleName } });
    if (!existing) {
      await repo.save(repo.create(r));
      console.log(`Created role: ${r.roleName}`);
    }
  }
}
