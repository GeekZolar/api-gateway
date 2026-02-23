import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepo: Repository<Role>,
  ) {}

  async findAll(): Promise<Role[]> {
    return this.roleRepo.find({ order: { roleName: 'ASC' } });
  }

  async findOne(roleId: string): Promise<Role> {
    const role = await this.roleRepo.findOne({ where: { roleId } });
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async findByRoleName(roleName: string): Promise<Role | null> {
    return this.roleRepo.findOne({ where: { roleName } });
  }

  async findForRegistration(): Promise<{ roleId: string; roleName: string }[]> {
    const roles = await this.roleRepo.find({
      where: { roleName: Not('System Administrator') },
      select: ['roleId', 'roleName'],
      order: { roleName: 'ASC' },
    });
    return roles;
  }

  async validateRoleId(roleId: string): Promise<boolean> {
    const role = await this.roleRepo.findOne({ where: { roleId } });
    return !!role;
  }
}
