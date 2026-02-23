import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MfaLoginVerifyDto {
  @ApiProperty({ description: 'Temporary MFA verification token received from login endpoint' })
  @IsNotEmpty()
  @IsString()
  mfaToken: string;

  @ApiProperty({ description: '6-digit MFA code from authenticator app' })
  @IsNotEmpty()
  @IsString()
  @Length(6, 6)
  mfaCode: string;
}
