import { IsIn, IsOptional, IsObject } from 'class-validator';

export class ExportReportDto {
  @IsIn(['current-inventory', 'valuation', 'variance', 'custom'])
  type: string;

  @IsIn(['xlsx', 'pdf', 'csv'])
  format: string;

  @IsOptional()
  @IsObject()
  filters?: Record<string, unknown>;
}
