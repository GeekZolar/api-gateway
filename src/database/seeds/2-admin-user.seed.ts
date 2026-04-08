import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../modules/users/entities/user.entity';
import { Role } from '../../modules/roles/entities/role.entity';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@ChangeMe123!';
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '12', 10);

export async function seedAdminUser(dataSource: DataSource): Promise<void> {
  const userRepo = dataSource.getRepository(User);
  const roleRepo = dataSource.getRepository(Role);

  const existing = await userRepo.findOne({ where: { username: ADMIN_USERNAME } });
  if (existing) {
    console.log('Admin user already exists');
    return;
  }

  const adminRole = await roleRepo.findOne({ where: { roleName: 'System Administrator' } });
  if (!adminRole) {
    throw new Error('System Administrator role not found. Run roles seed first.');
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, BCRYPT_ROUNDS);
  await userRepo.save(
    userRepo.create({
      username: ADMIN_USERNAME,
      email: ADMIN_EMAIL,
      passwordHash,
      firstName: 'System',
      lastName: 'Administrator',
      roleId: adminRole.roleId,
      isActive: true,
      isApproved: true,
    }),
  );
  console.log(`Admin user created: ${ADMIN_USERNAME}`);
}
