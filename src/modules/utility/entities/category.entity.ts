import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'categories', schema: 'snadb', synchronize: false })
export class Category {
  @PrimaryColumn({ name: 'category_id', type: 'int' })
  categoryId: number;

  @Column({ name: 'category_name', type: 'varchar', length: 255 })
  categoryName: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'modified_date', type: 'timestamptz', nullable: true })
  modifiedDate: Date | null;
}
