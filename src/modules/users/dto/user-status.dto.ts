import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserStatusDto {
  @ApiProperty()
  @IsBoolean()
  isActive: boolean;
}
