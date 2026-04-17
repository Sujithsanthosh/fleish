import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { SubscriptionPlan } from '../../entities/subscription-plan.entity';
import { UserSubscription, SubscriptionStatus } from '../../entities/user-subscription.entity';
import { SubscribeDto, CancelSubscriptionDto } from './dto/subscribe.dto';
import { PaymentsService } from '../payments/payments.service';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(SubscriptionPlan)
    private plansRepository: Repository<SubscriptionPlan>,

    @InjectRepository(UserSubscription)
    private subscriptionsRepository: Repository<UserSubscription>,

    private paymentsService: PaymentsService,
  ) { }

  // ─── Plans ────────────────────────────────────────────────────

  async getAllPlans(): Promise<SubscriptionPlan[]> {
    return this.plansRepository.find({
      where: { isActive: true },
      order: { price: 'ASC' },
    });
  }

  async getPlanById(id: string): Promise<SubscriptionPlan> {
    const plan = await this.plansRepository.findOne({ where: { id } });
    if (!plan) throw new NotFoundException('Plan not found');
    return plan;
  }

  // ─── Subscribe ────────────────────────────────────────────────

  async createSubscriptionOrder(planId: string, userId: string) {
    const plan = await this.getPlanById(planId);

    // Free plan — no payment needed
    if (plan.price === 0) {
      return this.activateSubscription(userId, planId, null);
    }

    // Create Razorpay order for paid plans
    const razorpayOrder = await this.paymentsService.createRazorpayOrder(
      plan.price,
      `SUB_${userId}_${planId}`,
    );

    return {
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      planId: plan.id,
      planName: plan.name,
    };
  }

  async confirmSubscription(userId: string, dto: SubscribeDto) {
    const plan = await this.getPlanById(dto.planId);

    // Free plan bypass
    if (plan.price === 0) {
      return this.activateSubscription(userId, dto.planId, null);
    }

    // For paid plans, verify payment was provided
    if (!dto.paymentId) {
      throw new BadRequestException('Payment ID is required for paid plans');
    }

    return this.activateSubscription(userId, dto.planId, dto.paymentId);
  }

  private async activateSubscription(
    userId: string,
    planId: string,
    paymentId: string | null,
  ): Promise<UserSubscription> {
    // Cancel any existing active subscription
    const existing = await this.getActiveSubscription(userId);
    if (existing) {
      existing.status = SubscriptionStatus.CANCELLED;
      await this.subscriptionsRepository.save(existing);
    }

    const plan = await this.getPlanById(planId);
    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + plan.durationDays);

    const subscription = this.subscriptionsRepository.create({
      user: { id: userId },
      plan: { id: planId },
      status: SubscriptionStatus.ACTIVE,
      startDate: now,
      endDate,
      paymentId: paymentId || undefined,
      autoRenew: true,
    } as any);

    return this.subscriptionsRepository.save(subscription as any) as any;
  }

  // ─── User Subscription ───────────────────────────────────────

  async getUserSubscription(userId: string) {
    const subscription = await this.getActiveSubscription(userId);
    if (!subscription) {
      return { hasSubscription: false, plan: null, subscription: null };
    }

    return {
      hasSubscription: true,
      plan: subscription.plan,
      subscription,
    };
  }

  async getActiveSubscription(userId: string): Promise<UserSubscription | null> {
    const now = new Date();
    return this.subscriptionsRepository.findOne({
      where: {
        userId,
        status: SubscriptionStatus.ACTIVE,
        endDate: MoreThanOrEqual(now),
      },
      relations: ['plan'],
      order: { createdAt: 'DESC' },
    });
  }

  // ─── Cancel ───────────────────────────────────────────────────

  async cancelSubscription(userId: string, dto: CancelSubscriptionDto) {
    const subscription = await this.getActiveSubscription(userId);
    if (!subscription) {
      throw new NotFoundException('No active subscription found');
    }

    subscription.status = SubscriptionStatus.CANCELLED;
    subscription.autoRenew = false;
    await this.subscriptionsRepository.save(subscription);

    return { message: 'Subscription cancelled successfully', subscription };
  }

  // ─── Checkout Benefits ────────────────────────────────────────

  async calculateCheckoutBenefits(userId: string, orderAmount: number, deliveryFee: number) {
    const subscription = await this.getActiveSubscription(userId);

    if (!subscription) {
      return {
        hasSubscription: false,
        discount: 0,
        deliveryFeeWaived: false,
        finalDeliveryFee: deliveryFee,
        savings: 0,
      };
    }

    const plan = subscription.plan;
    let discount = 0;
    let deliveryFeeWaived = false;
    let finalDeliveryFee = deliveryFee;

    // Apply discount
    if (plan.discountPercentage > 0) {
      discount = Math.round((orderAmount * plan.discountPercentage) / 100);
    }

    // Free delivery logic
    if (plan.isFreeDelivery) {
      deliveryFeeWaived = true;
      finalDeliveryFee = 0;
    } else if (plan.minOrderForFreeDelivery > 0 && orderAmount >= plan.minOrderForFreeDelivery) {
      deliveryFeeWaived = true;
      finalDeliveryFee = 0;
    }

    const savings = discount + (deliveryFeeWaived ? deliveryFee : 0);

    return {
      hasSubscription: true,
      planName: plan.name,
      discount,
      deliveryFeeWaived,
      finalDeliveryFee,
      savings,
      isPriority: plan.isPriority,
    };
  }

  // ─── Seed Plans (development helper) ─────────────────────────

  async seedPlans() {
    const existingPlans = await this.plansRepository.count();
    if (existingPlans > 0) {
      return { message: 'Plans already exist', count: existingPlans };
    }

    const plans = [
      {
        name: 'Free',
        price: 0,
        durationDays: 36500, // practically unlimited
        isFreeDelivery: false,
        minOrderForFreeDelivery: 0,
        discountPercentage: 0,
        isPriority: false,
        isMultiUser: false,
        benefits: ['Standard delivery charges', 'Basic order tracking', 'Customer support'],
      },
      {
        name: 'Basic',
        price: 99,
        durationDays: 30,
        isFreeDelivery: false,
        minOrderForFreeDelivery: 199,
        discountPercentage: 5,
        isPriority: false,
        isMultiUser: false,
        benefits: [
          'Free delivery on orders above ₹199',
          '5% discount on all orders',
          'Priority customer support',
          'Early access to offers',
        ],
      },
      {
        name: 'Pro',
        price: 199,
        durationDays: 30,
        isFreeDelivery: true,
        minOrderForFreeDelivery: 0,
        discountPercentage: 10,
        isPriority: true,
        isMultiUser: false,
        benefits: [
          'Free delivery on all orders',
          '10% discount on every order',
          'Priority order processing',
          'Exclusive member deals',
          'Premium customer support',
          'No surge pricing',
        ],
      },
      {
        name: 'Family',
        price: 299,
        durationDays: 30,
        isFreeDelivery: true,
        minOrderForFreeDelivery: 0,
        discountPercentage: 15,
        isPriority: true,
        isMultiUser: true,
        benefits: [
          'Everything in Pro plan',
          'Multi-user access (up to 4)',
          'Bulk order discounts (15%)',
          'Scheduled weekly delivery',
          'Dedicated account manager',
          'Free premium cuts upgrade',
          'Family recipe recommendations',
        ],
      },
    ];

    for (const plan of plans) {
      await this.plansRepository.save(this.plansRepository.create(plan));
    }

    return { message: 'Plans seeded successfully', count: plans.length };
  }
}
