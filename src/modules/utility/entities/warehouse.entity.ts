import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'warehouse', schema: 'snadb', synchronize: false })
export class Warehouse {
  @PrimaryColumn({ name: 'warehouse_id', type: 'int' })
  warehouseId: number;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'address', type: 'text', nullable: true })
  address: string | null;

  @Column({ name: 'location', type: 'varchar', length: 255, nullable: true })
  location: string | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
