import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';
import { Order } from './order.entity';

@Entity('vendors')
export class Vendor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  shopName: string;

  @Column()
  address: string;

  @Column({ type: 'double precision' })
  latitude: number;

  @Column({ type: 'double precision' })
  longitude: number;

  @Column({ default: 0 })
  rating: number;

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ default: 0 })
  currentLoad: number;

  @OneToOne(() => User)
  @JoinColumn()
  owner: User;

  @OneToMany(() => Product, (product) => product.vendor)
  products: Product[];

  @OneToMany(() => Order, (order) => order.vendor)
  orders: Order[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
