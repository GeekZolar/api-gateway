import { SetMetadata } from '@nestjs/common';

export type AppRole =
  | 'admin'
  | 'inventory-manager'
  | 'po-creator'
  | 'po-approver'
  | 'forecast-editor'
  | 'read-only'
  | 'user';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: AppRole[]) => SetMetadata(ROLES_KEY, roles);
