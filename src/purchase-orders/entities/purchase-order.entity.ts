import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Warehouse } from '../../modules/utility/entities/warehouse.entity';
import { Supplier } from '../../modules/utility/entities/supplier.entity';
import { PurchaseOrderLine } from './purchase-order-line.entity';

/** Maps to snadb.purchase_order */
@Entity({ name: 'purchase_order', schema: 'snadb' })
export class PurchaseOrder {
  @PrimaryGeneratedColumn('uuid', { name: 'purchase_order_id' })
  id: string;

  @Column({ name: 'po_number', type: 'varchar', length: 50, unique: true })
  poNumber: string;

  @Column({ name: 'supplier_id', type: 'uuid' })
  supplierId: string;

  @ManyToOne(() => Supplier, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @Column({ name: 'warehouse_id', type: 'uuid' })
  warehouseId: string;

  @ManyToOne(() => Warehouse, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @Column({ name: 'status', type: 'varchar', length: 30, default: 'Draft' })
  status: string;

  @Column({
    name: 'total_value',
    type: 'decimal',
    precision: 18,
    scale: 2,
    default: 0,
  })
  totalValue: string;

  @Column({
    name: 'sub_total',
    type: 'decimal',
    precision: 18,
    scale: 2,
    default: 0,
  })
  subTotal: string;

  @Column({ name: 'include_tax', type: 'boolean', default: false })
  includeTax: boolean;

  @Column({
    name: 'tax_rate',
    type: 'decimal',
    precision: 10,
    scale: 6,
    default: 0,
  })
  taxRate: string;

  @Column({
    name: 'tax_amount',
    type: 'decimal',
    precision: 18,
    scale: 2,
    default: 0,
  })
  taxAmount: string;

  @Column({ name: 'shipping_method', type: 'varchar', length: 100, nullable: true })
  shippingMethod: string | null;

  @Column({ name: 'currency', type: 'varchar', length: 10 })
  currency: string;

  @Column({ name: 'purchase_order_date', type: 'date' })
  purchaseOrderDate: string;

  @Column({ name: 'due_date', type: 'date', nullable: true })
  dueDate: string | null;

  @Column({ name: 'delivery_date', type: 'date', nullable: true })
  deliveryDate: string | null;

  @Column({ name: 'actual_delivery_date', type: 'date', nullable: true })
  actualDeliveryDate: string | null;

  @Column({ name: 'created_by_user_id', type: 'uuid' })
  createdByUserId: string;

  @Column({ name: 'approved_by_user_id', type: 'uuid', nullable: true })
  approvedByUserId: string | null;

  @Column({ name: 'approved_date', type: 'timestamp', nullable: true })
  approvedDate: Date | null;

  @Column({ name: 'quickbooks_po_id', type: 'varchar', length: 100, nullable: true })
  quickbooksPoId: string | null;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn({ name: 'created_date', type: 'timestamp' })
  createdDate: Date;

  @OneToMany(() => PurchaseOrderLine, (line) => line.purchaseOrder)
  lines: PurchaseOrderLine[];
}
