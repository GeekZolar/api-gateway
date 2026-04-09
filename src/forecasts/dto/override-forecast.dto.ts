import { IsOptional, IsUUID, IsDateString, IsNumber } from 'class-validator';

export class OverrideForecastDto {
  @IsOptional()
  @IsUUID()
  warehouseId?: string;

  @IsDateString()
  periodStart: string;

  @IsDateString()
  periodEnd: string;

  @IsNumber()
  overrideQty: number;
}
