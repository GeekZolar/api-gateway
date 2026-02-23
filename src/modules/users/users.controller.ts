import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserStatusDto } from './dto/user-status.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { ChangePasswordDto } from '../auth/dto/change-password.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { hasPermission } from '../../utils/validators.util';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create user (registration)' })
  async create(@Body() dto: CreateUserDto, @Req() req: RequestWithUser) {
    const createdBy = req.user?.userId;
    return this.usersService.create(dto, createdBy, req.ip, req.headers['user-agent']);
  }

  @Patch(':userId/approve')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('users.approve')
  @ApiOperation({ summary: 'Approve user' })
  async approve(
    @Param('userId') userId: string,
    @CurrentUser('userId') approvedBy: string,
    @Req() req: RequestWithUser,
  ) {
    return this.usersService.approve(userId, approvedBy, req.ip, req.headers['user-agent']);
  }

  @Patch(':userId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('users.update')
  @ApiOperation({ summary: 'Update user' })
  async update(
    @Param('userId') userId: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() user: RequestWithUser['user'],
    @Req() req: RequestWithUser,
  ) {
    const isAdmin = user && hasPermission(user.permissions, 'users.approve');
    return this.usersService.update(
      userId,
      dto,
      user!.userId,
      isAdmin,
      req.ip,
      req.headers['user-agent'],
    );
  }

  @Patch(':userId/status')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('users.update')
  @ApiOperation({ summary: 'Activate/deactivate user' })
  async setStatus(
    @Param('userId') userId: string,
    @Body() dto: UserStatusDto,
    @CurrentUser('userId') updatedBy: string,
    @Req() req: RequestWithUser,
  ) {
    return this.usersService.setStatus(
      userId,
      dto.isActive,
      updatedBy,
      req.ip,
      req.headers['user-agent'],
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('users.read')
  @ApiOperation({ summary: 'List users with pagination' })
  async findAll(@Query() query: UserQueryDto) {
    return this.usersService.findPaginated(query);
  }

  @Get(':userId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('users.read')
  @ApiOperation({ summary: 'Get user by ID' })
  async findOne(@Param('userId') userId: string) {
    return this.usersService.findOne(userId);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Change own password' })
  async changePassword(
    @CurrentUser('userId') userId: string,
    @Body() dto: ChangePasswordDto,
    @Req() req: RequestWithUser,
  ) {
    return this.usersService.changePassword(
      userId,
      dto.currentPassword,
      dto.newPassword,
      dto.confirmPassword,
      req.ip,
      req.headers['user-agent'],
    );
  }
}
