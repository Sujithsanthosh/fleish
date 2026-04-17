import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import { User } from './user.entity';

export enum DeliveryStatus {
  ASSIGNED = 'assigned',
  PICKED_UP = 'picked_up',
  ARRIVED_AT_DROP = 'arrived_at_drop',
  DELIVERED = 'delivered',
  FAILED = 'failed',
}

@Entity('deliveries')
export class Delivery {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: DeliveryStatus,
    default: DeliveryStatus.ASSIGNED,
  })
  status: DeliveryStatus;

  @Column({ nullable: true })
  otp: string;

  @ManyToOne(() => User) // The Rider
  rider: User;

  @OneToOne(() => Order, (order) => order.delivery)
  @JoinColumn()
  order: Order;

  @Column({ type: 'double precision', nullable: true })
  currentLat: number;

  @Column({ type: 'double precision', nullable: true })
  currentLng: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
