import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';

// These imports may not be resolvable if the files do not exist or are misnamed. 
// Please make sure the following files exist and have correct exports:
import { ProxyController } from './proxy.controller';
import { ProxyService } from './proxy.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    HttpModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        timeout: config.get('requestTimeout', 30000),
        maxRedirects: 0,
      }),
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get('jwtSecret'),
        signOptions: { expiresIn: '15m' },
      }),
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
  ],
  controllers: [ProxyController],
  providers: [ProxyService, JwtStrategy],
})
export class ProxyModule {}
