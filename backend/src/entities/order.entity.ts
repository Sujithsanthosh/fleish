import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Vendor } from './vendor.entity';
import { Delivery } from './delivery.entity';
import { Payment } from './payment.entity';

export enum OrderStatus {
  CREATED = 'created',
  VENDOR_ASSIGNED = 'vendor_assigned',
  ACCEPTED = 'accepted',
  CUTTING = 'cutting',
  READY_FOR_PICKUP = 'ready_for_pickup',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.CREATED,
  })
  status: OrderStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ nullable: true })
  deliveryAddress: string;

  @Column({ type: 'double precision', nullable: true })
  deliveryLat: number;

  @Column({ type: 'double precision', nullable: true })
  deliveryLng: number;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @ManyToOne(() => Vendor, (vendor) => vendor.orders, { nullable: true })
  vendor: Vendor;

  @OneToOne(() => Delivery, (delivery) => delivery.order, { nullable: true })
  delivery: Delivery;

  @OneToOne(() => Payment, (payment) => payment.order, { nullable: true })
  payment: Payment;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
