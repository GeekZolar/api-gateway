import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import type { PurchaseOrder } from './purchase-order.entity';
import { Product } from '../../inventory/entities/product.entity';

@Entity('purchase_order_lines')
export class PurchaseOrderLine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'purchase_order_id', type: 'uuid' })
  purchaseOrderId: string;

  @ManyToOne('PurchaseOrder', 'lines', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'purchase_order_id' })
  purchaseOrder: Relation<PurchaseOrder>;

  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  @ManyToOne(() => Product, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'ordered_qty', type: 'decimal', precision: 14, scale: 4 })
  orderedQty: number;

  @Column({ name: 'received_qty', type: 'decimal', precision: 14, scale: 4, default: 0 })
  receivedQty: number;

  @Column({ name: 'unit_cost', type: 'decimal', precision: 14, scale: 4, default: 0 })
  unitCost: number;
}
