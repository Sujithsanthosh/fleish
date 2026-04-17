import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { UserSubscription } from './user-subscription.entity';

@Entity('subscription_plans')
export class SubscriptionPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int', default: 30 }) // Duration in days
  durationDays: number;

  @Column({ type: 'boolean', default: false })
  isFreeDelivery: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  minOrderForFreeDelivery: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  discountPercentage: number;

  @Column({ type: 'boolean', default: false })
  isPriority: boolean;

  @Column({ type: 'boolean', default: false })
  isMultiUser: boolean;

  @Column({ type: 'text', array: true, default: [] })
  benefits: string[];

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => UserSubscription, (sub) => sub.plan)
  subscriptions: UserSubscription[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
