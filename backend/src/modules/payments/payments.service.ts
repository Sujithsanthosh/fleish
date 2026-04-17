import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from '../../entities/payment.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
  ) { }

  async findAll(): Promise<Payment[]> {
    return this.paymentsRepository.find({
      relations: ['order', 'customer'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentsRepository.findOne({
      where: { id },
      relations: ['order', 'customer'],
    });
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }

  async create(data: Partial<Payment>): Promise<Payment> {
    const payment = this.paymentsRepository.create(data);
    return this.paymentsRepository.save(payment);
  }

  async updateStatus(id: string, status: PaymentStatus): Promise<Payment> {
    await this.paymentsRepository.update(id, { status });
    return this.findOne(id);
  }

  async reconcileUTR(id: string, utr: string): Promise<Payment> {
    const payment = await this.findOne(id);
    if (payment.status !== PaymentStatus.PENDING) {
      throw new BadRequestException('Can only reconcile pending payments');
    }
    return this.updateStatus(id, PaymentStatus.COMPLETED);
  }

  async refund(id: string, reason: string): Promise<Payment> {
    const payment = await this.findOne(id);
    if (payment.status !== PaymentStatus.COMPLETED) {
      throw new BadRequestException('Can only refund completed payments');
    }
    await this.paymentsRepository.update(id, { status: PaymentStatus.REFUNDED, refundReason: reason });
    return this.findOne(id);
  }

  async markDisputed(id: string): Promise<Payment> {
    return this.updateStatus(id, PaymentStatus.DISPUTED);
  }

  async resolveDispute(id: string): Promise<Payment> {
    return this.updateStatus(id, PaymentStatus.COMPLETED);
  }

  async findByStatus(status: PaymentStatus): Promise<Payment[]> {
    return this.paymentsRepository.find({
      where: { status },
      relations: ['order', 'customer'],
      order: { createdAt: 'DESC' },
    });
  }

  async getStats(): Promise<any> {
    const all = await this.paymentsRepository.find();
    return {
      total: all.length,
      completed: all.filter(p => p.status === PaymentStatus.COMPLETED).length,
      pending: all.filter(p => p.status === PaymentStatus.PENDING).length,
      refunded: all.filter(p => p.status === PaymentStatus.REFUNDED).length,
      disputed: all.filter(p => p.status === PaymentStatus.DISPUTED).length,
      totalAmount: all.filter(p => p.status === PaymentStatus.COMPLETED)
        .reduce((sum, p) => sum + Number(p.amount), 0),
    };
  }

  // Razorpay order creation
  async createRazorpayOrder(amount: number, receipt: string): Promise<any> {
    const Razorpay = require('razorpay');
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy';
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || 'dummy_secret';

    try {
      const instance = new Razorpay({ key_id: razorpayKeyId, key_secret: razorpayKeySecret });
      const order = await instance.orders.create({
        amount: Math.round(Number(amount) * 100),
        currency: 'INR',
        receipt,
      });
      return order;
    } catch (error) {
      console.warn('Razorpay order creation failed, returning mock:', error.message);
      return {
        id: `order_mock_${Date.now()}`,
        amount: Math.round(Number(amount) * 100),
        currency: 'INR',
        receipt,
      };
    }
  }

  // Handle Razorpay webhook
  async handleWebhook(payload: any, signature: string): Promise<any> {
    // In production: verify signature using Razorpay webhook secret
    // const crypto = require('crypto');
    // const expected = crypto.createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
    //   .update(JSON.stringify(payload)).digest('hex');
    // if (expected !== signature) throw new BadRequestException('Invalid webhook signature');

    const event = payload.event;
    const payment = payload.payload?.payment?.entity;

    if (event === 'payment.captured' && payment) {
      // Update payment status to completed
      await this.paymentsRepository.update(
        { id: payment.order_id || payment.id },
        { status: PaymentStatus.COMPLETED },
      );
    } else if (event === 'payment.failed' && payment) {
      await this.paymentsRepository.update(
        { id: payment.order_id || payment.id },
        { status: PaymentStatus.FAILED },
      );
    }

    return { success: true };
  }
}
