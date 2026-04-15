import { IsDateString, IsArray, ValidateNested, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReceivePurchaseOrderLineDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  poLineId: string;

  @ApiProperty()
  @IsNumber()
  receivedQty: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lotNumber?: string;

  @ApiPropertyOptional({ format: 'date' })
  @IsOptional()
  @IsDateString()
  expiryDate?: string;
}

export class ReceivePurchaseOrderDto {
  @ApiProperty({ format: 'date-time' })
  @IsDateString()
  receiptDate: string;

  @ApiProperty({ type: [ReceivePurchaseOrderLineDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReceivePurchaseOrderLineDto)
  lines: ReceivePurchaseOrderLineDto[];
}
