import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Vendor } from './vendor.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column()
  unit: string; // e.g., kg, gm

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ nullable: true })
  category: string;

  @ManyToOne(() => Vendor, (vendor) => vendor.products)
  vendor: Vendor;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
