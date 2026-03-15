import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly saltRounds = 10;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<Omit<User, 'passwordHash'>> {
    const existingEmail = await this.userRepository.findOne({ where: { email: dto.email } });
    if (existingEmail) {
      throw new ConflictException('Email already registered');
    }
    const existingUsername = await this.userRepository.findOne({ where: { username: dto.username } });
    if (existingUsername) {
      throw new ConflictException('Username already taken');
    }

    const passwordHash = await bcrypt.hash(dto.password, this.saltRounds);
    const user = this.userRepository.create({
      email: dto.email,
      username: dto.username,
      passwordHash,
      role: 'user',
    });
    const saved = await this.userRepository.save(user);
    const { passwordHash: _, ...result } = saved;
    return result;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async updatePassword(userId: string, passwordHash: string): Promise<void> {
    await this.userRepository.update(userId, { passwordHash });
  }

  async getProfile(userId: string): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    const { passwordHash: _, ...result } = user;
    return result;
  }

  async updateProfile(userId: string, dto: UpdateUserDto): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    if (dto.email !== undefined && dto.email !== user.email) {
      const existing = await this.findByEmail(dto.email);
      if (existing) throw new ConflictException('Email already in use');
    }
    if (dto.username !== undefined && dto.username !== user.username) {
      const existing = await this.findByUsername(dto.username);
      if (existing) throw new ConflictException('Username already taken');
    }
    if (dto.email !== undefined) user.email = dto.email;
    if (dto.username !== undefined) user.username = dto.username;
    const saved = await this.userRepository.save(user);
    const { passwordHash: _, ...result } = saved;
    return result;
  }

  async list(page = 1, pageSize = 20): Promise<{ items: Omit<User, 'passwordHash'>[]; total: number; page: number; pageSize: number }> {
    const [items, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { createdAt: 'DESC' },
    });
    const safe = items.map((u) => {
      const { passwordHash: _, ...rest } = u;
      return rest;
    });
    return { items: safe, total, page, pageSize };
  }

  async updateRoles(userId: string, roles: string[]): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    const role = roles?.[0] ?? user.role;
    user.role = role;
    const saved = await this.userRepository.save(user);
    const { passwordHash: _, ...result } = saved;
    return result;
  }
}
