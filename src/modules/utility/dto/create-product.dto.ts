import {
  IsBoolean,
  IsDateString,
  IsInt,
  Min,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  MinLength,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @ApiPropertyOptional({
    description: 'product_id (auto-generated UUID)',
    readOnly: true,
  })
  @IsOptional()
  @IsUUID()
  productId?: string;

  @ApiPropertyOptional({ description: 'supplier_id', type: String, nullable: true })
  @IsOptional()   
  @IsUUID()
  supplierId?: string | null;

  @ApiProperty({ description: 'snadb.products.product_name', minLength: 1, maxLength: 500 })
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  productName: string;

  @ApiPropertyOptional({ description: 'description', type: String, nullable: true })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiPropertyOptional({ description: 'category_id', type: String, nullable: true })
  @IsOptional()
  @IsUUID()
  categoryId?: string | null;

  @ApiPropertyOptional({
    description: 'product_size',
    type: String,
    nullable: true,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  productSize?: string | null;

  @ApiPropertyOptional({ description: 'sku', type: String, nullable: true, maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  sku?: string | null;

  @ApiPropertyOptional({ description: 'min_order_pallet', type: Number, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  minOrderPallet?: number | null;

  @ApiPropertyOptional({ description: 'case_per_pallet', type: Number, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  casePerPallet?: number | null;

  @ApiPropertyOptional({ description: 'shelf_life_month', type: Number, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(600)
  shelfLifeMonth?: number | null;

  @ApiPropertyOptional({ description: 'is_active', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'is_seasonal', default: false })
  @IsOptional()
  @IsBoolean()
  isSeasonal?: boolean;

  @ApiPropertyOptional({
    description: 'season_start_date (YYYY-MM-DD)',
    type: String,
    format: 'date',
    nullable: true,
  })
  @IsOptional()
  @IsDateString()
  seasonStartDate?: string | null;

  @ApiPropertyOptional({
    description: 'season_end_date (YYYY-MM-DD)',
    type: String,
    format: 'date',
    nullable: true,
  })
  @IsOptional()
  @IsDateString()
  seasonEndDate?: string | null;

  @ApiPropertyOptional({ description: 'country_code', type: String, nullable: true, maxLength: 10 })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  countryCode?: string | null;

  @ApiPropertyOptional({
    description: 'modified_at (ISO timestamp)',
    type: String,
    format: 'date-time',
    nullable: true,
  })
  @IsOptional()
  @IsDateString()
  modifiedAt?: string | null;

  @ApiProperty({ description: 'total_cost' })
  @Type(() => Number)
  @IsNumber()
  totalCost: number;

  @ApiPropertyOptional({ description: 'note', type: String, nullable: true })
  @IsOptional()
  @IsString()
  note?: string | null;
}

