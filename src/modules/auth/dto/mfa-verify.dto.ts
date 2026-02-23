import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MfaVerifyDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(6, 6)
  code: string;
}
