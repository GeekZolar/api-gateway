import { IsArray, IsString, IsIn } from 'class-validator';

const VALID_ROLES = ['admin', 'inventory-manager', 'po-creator', 'po-approver', 'forecast-editor', 'read-only', 'user'];

export class UpdateRolesDto {
  @IsArray()
  @IsString({ each: true })
  @IsIn(VALID_ROLES, { each: true })
  roles: string[];
}
