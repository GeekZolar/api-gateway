import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import type { Transfer } from './transfer.entity';
import { Product } from '../../modules/utility/entities/product.entity';

@Entity('transfer_lines')
export class TransferLine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'transfer_id', type: 'uuid' })
  transferId: string;

  @ManyToOne('Transfer', 'lines', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'transfer_id' })
  transfer: Relation<Transfer>;

  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'requested_qty', type: 'decimal', precision: 14, scale: 4 })
  requestedQty: number;

  @Column({ name: 'shipped_qty', type: 'decimal', precision: 14, scale: 4, default: 0 })
  shippedQty: number;

  @Column({ name: 'received_qty', type: 'decimal', precision: 14, scale: 4, default: 0 })
  receivedQty: number;
}
