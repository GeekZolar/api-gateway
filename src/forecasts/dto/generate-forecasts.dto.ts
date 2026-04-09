import { IsOptional, IsArray, IsUUID, IsString, IsInt, Min, Max } from 'class-validator';

export class GenerateForecastsDto {
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  warehouseIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skuList?: string[];

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(365)
  horizonDays?: number = 180;
}
