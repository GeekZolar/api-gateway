import { IsString, IsUUID, IsNumber, IsOptional, IsIn, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const ADJUST_REASONS = ['cycle_count', 'damage', 'expiry', 'found', 'other'] as const;

export class AdjustInventoryDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  productId: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  warehouseId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lotNumber?: string;

  @ApiPropertyOptional({ format: 'date' })
  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @ApiProperty({ description: 'Positive or negative quantity change' })
  @IsNumber()
  quantityDelta: number;

  @ApiProperty({ enum: ADJUST_REASONS })
  @IsIn([...ADJUST_REASONS])
  reason: string;
}
