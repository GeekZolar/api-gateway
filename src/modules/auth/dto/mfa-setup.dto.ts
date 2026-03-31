import { IsNotEmpty, IsString, IsOptional, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MfaSetupDto {
  // @ApiProperty({
  //   description: 'Issuer name shown in Google/Microsoft Authenticator (e.g. app or company name)',
  //   example: 'IMS',
  //   maxLength: 40,
  //   minLength: 1,
  // })
  // @IsNotEmpty()
  // @IsString()
  // @MinLength(1)
  // @MaxLength(40)
  // issuer: string;

  @ApiProperty({
    description: 'User email address',
    example: 'admin@example.com',
    maxLength: 64,
    minLength: 1,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  emailAddress: string;

  // @ApiPropertyOptional({
  //   description: 'Whether to include a QR code data URL in the response (default: true)',
  //   default: true,
  // })
  // @IsOptional()
  // includeQrCode?: boolean;
}
