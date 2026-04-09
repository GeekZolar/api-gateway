import { IsString, IsOptional, IsIn, MinLength, MaxLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  sku: string;

  @IsString()
  @MinLength(1)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  uom?: string;

  @IsOptional()
  @IsIn(['active', 'discontinued'])
  status?: string;
}
