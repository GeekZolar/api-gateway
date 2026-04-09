import { IsDateString, IsArray, ValidateNested, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class ReceivePurchaseOrderLineDto {
  @IsUUID()
  poLineId: string;

  @IsNumber()
  receivedQty: number;

  @IsOptional()
  @IsString()
  lotNumber?: string;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;
}

export class ReceivePurchaseOrderDto {
  @IsDateString()
  receiptDate: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReceivePurchaseOrderLineDto)
  lines: ReceivePurchaseOrderLineDto[];
}
