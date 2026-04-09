import { IsUUID, IsDateString, IsArray, ValidateNested, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePurchaseOrderLineDto {
  @IsOptional()
  @IsUUID()
  productId?: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsNumber()
  orderedQty: number;

  @IsOptional()
  @IsNumber()
  unitCost?: number;
}

export class CreatePurchaseOrderDto {
  @IsUUID()
  supplierId: string;

  @IsUUID()
  warehouseId: string;

  @IsDateString()
  expectedDate: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePurchaseOrderLineDto)
  lines: CreatePurchaseOrderLineDto[];
}
