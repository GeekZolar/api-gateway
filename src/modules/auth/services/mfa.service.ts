import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import { encrypt, decrypt, generateSecureToken } from '../../../utils/encryption.util';
import { MFA_BACKUP_CODES_COUNT } from '../../../utils/constants';

export interface MfaGenerateSecretOptions {
  issuer: string;
  accountName: string;
}

@Injectable()
export class MfaService {
  private readonly defaultIssuer: string;
  private readonly window: number;

  constructor(private config: ConfigService) {
    this.defaultIssuer = this.config.get<string>('mfaIssuer', 'IMS');
    this.window = this.config.get<number>('mfaWindow', 1);
  }

  /**
   * Generate a TOTP secret and otpauth URL for Google/Microsoft Authenticator.
   * Uses issuer and accountName so the app shows the correct label and issuer.
   */
  generateSecret(options: MfaGenerateSecretOptions): { secret: string; otpauthUrl: string } {
    const { issuer, accountName } = options;
    const secret = speakeasy.generateSecret({
      length: 32,
      otpauth_url: false,
    });
    const label = `${issuer}:${accountName}`;
    const otpauthUrl = speakeasy.otpauthURL({
      secret: secret.base32,
      label,
      issuer,
      encoding: 'base32',
    });
    return {
      secret: secret.base32,
      otpauthUrl,
    };
  }

  async getQrCodeUrl(otpauthUrl: string): Promise<string> {
    return QRCode.toDataURL(otpauthUrl);
  }

  verifyToken(secret: string, token: string): boolean {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: this.window,
    });
  }

  encryptSecret(secret: string): string {
    return encrypt(secret);
  }

  decryptSecret(encrypted: string): string {
    return decrypt(encrypted);
  }

  generateBackupCodes(): string[] {
    const codes: string[] = [];
    for (let i = 0; i < MFA_BACKUP_CODES_COUNT; i++) {
      codes.push(generateSecureToken(4).toUpperCase().replace(/(.{4})/g, '$1-').slice(0, -1));
    }
    return codes;
  }
}
