import { IsOptional, IsUUID, IsString } from 'class-validator';

export class ReplenishmentQueryDto {
  @IsOptional()
  @IsUUID()
  warehouseId?: string;

  @IsOptional()
  @IsString()
  sku?: string;
}
