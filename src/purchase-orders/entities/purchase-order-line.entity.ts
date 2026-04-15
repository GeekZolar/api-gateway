import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import type { PurchaseOrder } from './purchase-order.entity';
import { Product } from '../../modules/utility/entities/product.entity';

/** Maps to snadb.purchase_order_line */
@Entity({ name: 'purchase_order_line', schema: 'snadb' })
export class PurchaseOrderLine {
  @PrimaryGeneratedColumn('uuid', { name: 'po_line_id' })
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

  @Column({ name: 'ordered_quantity', type: 'decimal', precision: 18, scale: 2 })
  orderedQuantity: string;

  @Column({
    name: 'received_quantity',
    type: 'decimal',
    precision: 18,
    scale: 2,
    default: 0,
  })
  receivedQuantity: string;

  @Column({ name: 'unit_cost', type: 'decimal', precision: 18, scale: 2 })
  unitCost: string;

  @Column({ name: 'line_total', type: 'decimal', precision: 18, scale: 2 })
  lineTotal: string;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string | null;
}
