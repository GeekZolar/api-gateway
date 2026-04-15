import { IsIn, IsOptional, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const REPORT_TYPES = ['current-inventory', 'valuation', 'variance', 'custom'] as const;
const EXPORT_FORMATS = ['xlsx', 'pdf', 'csv'] as const;

export class ExportReportDto {
  @ApiProperty({ enum: REPORT_TYPES })
  @IsIn([...REPORT_TYPES])
  type: string;

  @ApiProperty({ enum: EXPORT_FORMATS })
  @IsIn([...EXPORT_FORMATS])
  format: string;

  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: true,
    description: 'Optional filters passed to the export job',
  })
  @IsOptional()
  @IsObject()
  filters?: Record<string, unknown>;
}
