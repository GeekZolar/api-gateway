import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Warehouse } from './warehouse.entity';
import { TransferLine } from './transfer-line.entity';

@Entity('transfers')
export class Transfer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'transfer_number', type: 'varchar', unique: true })
  transferNumber: string;

  @Column({ name: 'from_warehouse_id', type: 'uuid' })
  fromWarehouseId: string;

  @ManyToOne(() => Warehouse, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'from_warehouse_id' })
  fromWarehouse: Warehouse;

  @Column({ name: 'to_warehouse_id', type: 'uuid' })
  toWarehouseId: string;

  @ManyToOne(() => Warehouse, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'to_warehouse_id' })
  toWarehouse: Warehouse;

  @Column({ type: 'varchar', default: 'draft' })
  status: string;

  @Column({ name: 'requested_date', type: 'date' })
  requestedDate: string;

  @Column({ name: 'completed_date', type: 'date', nullable: true })
  completedDate: string | null;

  @Column({ name: 'created_by_user_id', type: 'uuid', nullable: true })
  createdByUserId: string | null;

  @OneToMany(() => TransferLine, (line) => line.transfer)
  lines: TransferLine[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
