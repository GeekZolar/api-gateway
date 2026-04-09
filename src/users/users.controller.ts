import { Controller, Post, Get, Patch, Put, Body, Req, Param, Query, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateRolesDto } from './dto/update-roles.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User created' })
  @ApiResponse({ status: 409, description: 'Email or username already exists' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user (alias for POST /users)' })
  @ApiResponse({ status: 201, description: 'User created' })
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Current user (no password)' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: { user: { userId: string } }) {
    return this.usersService.getProfile(req.user.userId);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List users (Admin only)' })
  @ApiResponse({ status: 200, description: 'Paginated user list' })
  @ApiResponse({ status: 403, description: 'Admin only' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async list(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    const p = page ? Number(page) : 1;
    const ps = pageSize ? Number(pageSize) : 20;
    return this.usersService.list(p, ps);
  }

  @Patch()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user (email and/or username)' })
  @ApiResponse({ status: 200, description: 'Updated user' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Req() req: { user: { userId: string } }, @Body() dto: UpdateUserDto) {
    return this.usersService.updateProfile(req.user.userId, dto);
  }

  @Put(':id/roles')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user roles (Admin only)' })
  @ApiResponse({ status: 200, description: 'Roles updated' })
  @ApiResponse({ status: 403, description: 'Admin only' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updateRoles(@Param('id') id: string, @Body() dto: UpdateRolesDto) {
    return this.usersService.updateRoles(id, dto.roles);
  }
}
