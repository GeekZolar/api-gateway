import { IsUUID, IsArray, ValidateNested, IsNumber, IsOptional, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTransferLineDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  productId: string;

  @ApiProperty()
  @IsNumber()
  requestedQty: number;

  @ApiPropertyOptional({ format: 'date' })
  @IsOptional()
  @IsDateString()
  expiryDate?: string;
}

export class CreateTransferDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  fromWarehouseId: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  toWarehouseId: string;

  @ApiPropertyOptional({ format: 'date' })
  @IsOptional()
  @IsDateString()
  requestedDate?: string;

  @ApiProperty({ type: [CreateTransferLineDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTransferLineDto)
  lines: CreateTransferLineDto[];
}
