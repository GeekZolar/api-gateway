import {
  IsUUID,
  IsDateString,
  IsArray,
  ValidateNested,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  IsBoolean,
  MinLength,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePurchaseOrderLineDto {
  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  productId?: string;

  @ApiPropertyOptional({ description: 'sku' })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  orderedQty: number;

  @ApiProperty({ description: 'Unit cost for line_total = orderedQty × unit_cost' })
  @Type(() => Number)
  @IsNumber()
  unitCost: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreatePurchaseOrderDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  supplierId: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  warehouseId: string;

  @ApiProperty({ maxLength: 10, example: 'USD' })
  @IsString()
  @MaxLength(10)
  currency: string;

  @ApiProperty({ format: 'date', description: 'purchase_order_date' })
  @IsDateString()
  purchaseOrderDate: string;

  @ApiPropertyOptional({ format: 'date' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({ format: 'date' })
  @IsOptional()
  @IsDateString()
  deliveryDate?: string;

  @ApiPropertyOptional({ description: 'include_tax', default: false })
  @IsOptional()
  @IsBoolean()
  includeTax?: boolean = false;

  @ApiPropertyOptional({ description: 'tax_rate', default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  taxRate?: number = 0;

  @ApiProperty({ description: 'sub_total' })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  subTotal: number;

  @ApiPropertyOptional({ description: 'tax_amount' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  taxAmount?: number = 0;

  @ApiProperty({ description: 'total_value = sub_total + tax_amount' })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  totalValue: number;

  @ApiProperty({ description: 'shipping_method' })
  @IsString()
  @MinLength(1)
  shippingMethod: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  quickbooksPoId?: string;

  @ApiProperty({ type: [CreatePurchaseOrderLineDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePurchaseOrderLineDto)
  lines: CreatePurchaseOrderLineDto[];
}
