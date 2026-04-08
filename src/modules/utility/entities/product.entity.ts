import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'products', schema: 'snadb', synchronize: false })
export class Product {
  @PrimaryColumn({ name: 'product_id', type: 'int' })
  productId: number;

  @Column({ name: 'supplier_id', type: 'int', nullable: true })
  supplierId: number | null;

  @Column({ name: 'product_name', type: 'varchar', length: 500 })
  productName: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'category_id', type: 'int', nullable: true })
  categoryId: number | null;

  @Column({ name: 'product_size', type: 'varchar', length: 255, nullable: true })
  productSize: string | null;

  @Column({ name: 'sku', type: 'varchar', length: 100, nullable: true })
  sku: string | null;

  @Column({ name: 'min_order_pallet', type: 'int', nullable: true })
  minOrderPallet: number | null;

  @Column({ name: 'case_per_pallet', type: 'int', nullable: true })
  casePerPallet: number | null;

  @Column({ name: 'shelf_life_month', type: 'int', nullable: true })
  shelfLifeMonth: number | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'is_seasonal', type: 'boolean', default: false })
  isSeasonal: boolean;

  @Column({ name: 'season_start_date', type: 'date', nullable: true })
  seasonStartDate: Date | null;

  @Column({ name: 'season_end_date', type: 'date', nullable: true })
  seasonEndDate: Date | null;

  @Column({ name: 'country_code', type: 'varchar', length: 10, nullable: true })
  countryCode: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'modified_at', type: 'timestamptz', nullable: true })
  modifiedAt: Date | null;

  @Column({ name: 'note', type: 'text', nullable: true })
  note: string | null;
}
