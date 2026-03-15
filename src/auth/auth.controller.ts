import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { PasswordResetRequestDto } from './dto/password-reset-request.dto';
import { PasswordResetConfirmDto } from './dto/password-reset-confirm.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login with username and password' })
  @ApiResponse({ status: 200, description: 'Returns accessToken and refreshToken' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @Throttle({ default: { limit: 5, ttl: 900000 } })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Get new access token using refresh token' })
  @ApiResponse({ status: 200, description: 'Returns new accessToken' })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  async refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout (client should discard token)' })
  @ApiResponse({ status: 200, description: 'Logged out' })
  async logout() {
    return this.authService.logout();
  }

  @Post('password-reset/request')
  @ApiOperation({ summary: 'Request password reset email' })
  @ApiResponse({ status: 200, description: 'In dev, response may include token for testing' })
  @Throttle({ default: { limit: 3, ttl: 900000 } })
  async passwordResetRequest(@Body() dto: PasswordResetRequestDto) {
    return this.authService.passwordResetRequest(dto);
  }

  @Post('password-reset/confirm')
  @ApiOperation({ summary: 'Confirm password reset with token and new password' })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  async passwordResetConfirm(@Body() dto: PasswordResetConfirmDto) {
    return this.authService.passwordResetConfirm(dto);
  }
}
