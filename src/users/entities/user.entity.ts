import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  // Database schema uses `user_id` as the PK column name (not `id`).
  @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
  id: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar', unique: true })
  username: string;

  @Column({ name: 'password_hash', type: 'varchar' })
  passwordHash: string;

  // Database uses `role_id` (uuid) rather than a string `role` column.
  @Column({ name: 'role_id', type: 'uuid', nullable: true })
  role: string | null;

  @CreateDateColumn({ name: 'created_date' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_date' })
  updatedAt: Date;
}
