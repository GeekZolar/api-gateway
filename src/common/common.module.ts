import { Global, Module } from '@nestjs/common';
import { RolesGuard } from './guards/roles.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { PermissionsGuard } from './guards/permissions.guard';

@Global()
@Module({
  providers: [RolesGuard, JwtAuthGuard, JwtRefreshGuard, PermissionsGuard],
  exports: [RolesGuard, JwtAuthGuard, JwtRefreshGuard, PermissionsGuard],
})
export class CommonModule {}

