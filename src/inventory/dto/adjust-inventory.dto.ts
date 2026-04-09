import { IsString, IsUUID, IsNumber, IsOptional, IsIn, IsDateString } from 'class-validator';

export class AdjustInventoryDto {
  @IsUUID()
  productId: string;

  @IsUUID()
  warehouseId: string;

  @IsOptional()
  @IsString()
  lotNumber?: string;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @IsNumber()
  quantityDelta: number;

  @IsIn(['cycle_count', 'damage', 'expiry', 'found', 'other'])
  reason: string;
}
