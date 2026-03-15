import { IsUUID, IsArray, ValidateNested, IsNumber, IsOptional, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTransferLineDto {
  @IsUUID()
  productId: string;

  @IsNumber()
  requestedQty: number;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;
}

export class CreateTransferDto {
  @IsUUID()
  fromWarehouseId: string;

  @IsUUID()
  toWarehouseId: string;

  @IsOptional()
  @IsDateString()
  requestedDate?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTransferLineDto)
  lines: CreateTransferLineDto[];
}
