import { IsOptional, IsArray, IsUUID, IsString, IsInt, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GenerateForecastsDto {
  @ApiPropertyOptional({ type: [String], format: 'uuid', isArray: true })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  warehouseIds?: string[];

  @ApiPropertyOptional({ type: [String], isArray: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skuList?: string[];

  @ApiPropertyOptional({ minimum: 1, maximum: 365, default: 180 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(365)
  horizonDays?: number = 180;
}
