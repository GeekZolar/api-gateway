import { IsOptional, IsUUID, IsString, IsDateString } from 'class-validator';

export class AccuracyQueryDto {
  @IsDateString()
  from: string;

  @IsDateString()
  to: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsUUID()
  warehouseId?: string;
}
