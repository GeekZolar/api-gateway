import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { User } from '../users/entities/user.entity';
import { PasswordHistory } from '../users/entities/password-history.entity';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { PasswordService } from './services/password.service';
import { MfaService } from './services/mfa.service';
import { SessionsModule } from '../sessions/sessions.module';
import { AuditModule } from '../audit/audit.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([User, PasswordHistory, PasswordResetToken]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('jwt.accessSecret'),
        signOptions: { expiresIn: config.get('jwt.accessExpiration', '15m') },
      }),
      inject: [ConfigService],
    }),
    SessionsModule,
    AuditModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RefreshTokenStrategy, PasswordService, MfaService],
  exports: [AuthService, PasswordService, JwtModule, PassportModule],
})
export class AuthModule {}
