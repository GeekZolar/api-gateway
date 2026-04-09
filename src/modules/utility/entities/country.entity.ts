import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'countries', schema: 'snadb', synchronize: false })
export class Country {
  @PrimaryColumn({ name: 'country_code', type: 'varchar', length: 10 })
  countryCode: string;

  @Column({ name: 'country_name', type: 'varchar', length: 255 })
  countryName: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
