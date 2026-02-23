import { Controller, Post, Body, Get, Delete, Param, UseGuards, Req } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { MfaVerifyDto } from './dto/mfa-verify.dto';
import { MfaSetupDto } from './dto/mfa-setup.dto';
import { MfaLoginVerifyDto } from './dto/mfa-login-verify.dto';
import {
  PasswordResetRequestDto,
  PasswordResetConfirmDto,
} from './dto/password-reset.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { JwtRefreshGuard } from '../../common/guards/jwt-refresh.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { User } from '../users/entities/user.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 900000 } })
  @ApiOperation({ summary: 'Login with username and password' })
  async login(
    @Body() dto: LoginDto,
    @Req() req: RequestWithUser,
  ) {
    const ip = req.ip;
    const ua = req.headers['user-agent'];
    return this.authService.login(
      dto.username,
      dto.password,
      ip,
      ua,
    );
  }

  @Post('mfa/verify-login')
  @Throttle({ default: { limit: 5, ttl: 900000 } })
  @ApiOperation({ summary: 'Verify MFA code and complete login' })
  async verifyMfaAndLogin(
    @Body() dto: MfaLoginVerifyDto,
    @Req() req: RequestWithUser,
  ) {
    const ip = req.ip;
    const ua = req.headers['user-agent'];
    return this.authService.verifyMfaAndLogin(
      dto.mfaToken,
      dto.mfaCode,
      ip,
      ua,
    );
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  @ApiOperation({ summary: 'Refresh access token' })
  async refresh(
    @Body() dto: RefreshTokenDto,
    @Req() req: RequestWithUser,
  ) {
    const ip = req.ip;
    const ua = req.headers['user-agent'];
    const user = req.user as unknown as User & { sessionId: string };
    return this.authService.refresh(user, dto.refreshToken, ip, ua);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Logout' })
  async logout(@CurrentUser('userId') userId: string, @CurrentUser('sessionId') sessionId: string) {
    return this.authService.logout(userId, sessionId);
  }

  @Post('mfa/setup')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Setup MFA (Google/Microsoft Authenticator)',
    description:
      'Requires the **access token** in the Authorization header (Bearer). Use the accessToken from login, or from POST /auth/mfa/verify-login if login returned mfaRequired.',
  })
  async mfaSetup(@CurrentUser() user: User, @Body() dto: MfaSetupDto) {
    return this.authService.mfaSetup(user, dto.accountName as string);
  }

  @Post('mfa/verify')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Verify MFA and enable' })
  async mfaVerify(@CurrentUser('userId') userId: string, @Body() dto: MfaVerifyDto) {
    return this.authService.mfaVerify(userId, dto.code);
  }

  @Post('password-reset/request')
  @Throttle({ default: { limit: 3, ttl: 3600000 } })
  @ApiOperation({ summary: 'Request password reset' })
  async passwordResetRequest(
    @Body() dto: PasswordResetRequestDto,
    @Req() req: RequestWithUser,
  ) {
    return this.authService.passwordResetRequest(dto.email, req.ip);
  }

  @Post('password-reset/confirm')
  @ApiOperation({ summary: 'Confirm password reset' })
  async passwordResetConfirm(@Body() dto: PasswordResetConfirmDto) {
    return this.authService.passwordResetConfirm(dto.token, dto.newPassword);
  }

  @Get('sessions')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List active sessions' })
  async getSessions(
    @CurrentUser('userId') userId: string,
    @CurrentUser('sessionId') sessionId: string,
  ) {
    return this.authService.getActiveSessions(userId, sessionId);
  }

  @Delete('sessions/:sessionId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Revoke a session' })
  async revokeSession(
    @CurrentUser('userId') userId: string,
    @Param('sessionId') sessionId: string,
  ) {
    return this.authService.revokeSession(userId, sessionId);
  }
}
