import { IsOptional, IsString, IsUUID, IsIn, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterInventoryDto {
  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsUUID()
  warehouseId?: string;

  @IsOptional()
  @IsIn(['available', 'quarantine', 'damaged', 'expired'])
  status?: string;

  @IsOptional()
  @IsString()
  lotNumber?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(500)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 20;
}
