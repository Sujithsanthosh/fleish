import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from '../../entities/order.entity';
import { VendorsService } from '../vendors/vendors.service';
// import { InjectQueue } from '@nestjs/bullmq';
// import { Queue } from 'bullmq';
import { RealtimeGateway } from '../realtime/realtime.gateway';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    private vendorsService: VendorsService,
    private realtimeGateway: RealtimeGateway,
    // @InjectQueue('order-assignment') private assignmentQueue: Queue,
  ) { }

  async create(orderData: any, userId: string): Promise<Order> {
    const order = this.ordersRepository.create({
      ...orderData,
      user: { id: userId },
    } as any);

    const savedOrder = await this.ordersRepository.save(order as unknown as Order);

    // Trigger Smart Assignment
    if (orderData.lat && orderData.lng) {
      await this.assignBestVendor(savedOrder.id, orderData.lat, orderData.lng);
    } else {
      // If no location provided, assign to first available vendor
      await this.ordersRepository.update(savedOrder.id, {
        status: OrderStatus.VENDOR_ASSIGNED,
      });
    }

    return savedOrder;
  }

  async findOne(id: string): Promise<Order | null> {
    return this.ordersRepository.findOne({
      where: { id },
      relations: ['user', 'vendor', 'delivery'],
    });
  }

  async assignBestVendor(orderId: string, lat: number, lng: number) {
    const nearestVendors = await this.vendorsService.findNearest(lat, lng);

    if (nearestVendors.length === 0) {
      throw new Error('No vendors available in this area');
    }

    // Try assigning to the first (best) vendor
    const bestVendor = nearestVendors[0];

    await this.ordersRepository.update(orderId, {
      vendor: bestVendor,
      status: OrderStatus.VENDOR_ASSIGNED,
    });

    // Notify Vendor via WebSockets
    this.realtimeGateway.notifyVendor(bestVendor.id, 'order_update', { orderId, type: 'new_order' });

    // Queue disabled - Redis not available in production
    // await this.assignmentQueue.add('check-acceptance', { orderId, vendorId: bestVendor.id }, { delay: 30000 });
  }

  async updateStatus(orderId: string, status: OrderStatus, user?: any) {
    const order = await this.ordersRepository.findOne({ where: { id: orderId }, relations: ['user', 'vendor'] });
    if (!order) throw new NotFoundException('Order not found');

    // Only allow vendor to update if they own the order
    if (user && user.role === 'vendor' && order.vendor && order.vendor.id !== user.userId) {
      throw new BadRequestException('You can only update your own orders');
    }

    order.status = status;
    await this.ordersRepository.save(order);

    // Notify Customer and Vendor with correct event name
    const eventData = { orderId, status, timestamp: new Date().toISOString() };

    if (order.user) {
      this.realtimeGateway.notifyUser(order.user.id, 'order_update', eventData);
    }
    if (order.vendor) {
      this.realtimeGateway.notifyVendor(order.vendor.id, 'order_update', eventData);
    }

    return order;
  }

  async findAllByRole(role: string, roleId: string): Promise<Order[]> {
    if (role === 'customer') {
      return this.ordersRepository.find({
        where: { user: { id: roleId } },
        relations: ['vendor'],
        order: { createdAt: 'DESC' },
      });
    } else if (role === 'vendor') {
      return this.ordersRepository.find({
        where: { vendor: { id: roleId } },
        relations: ['user'],
        order: { createdAt: 'DESC' },
      });
    } else if (role === 'admin') {
      return this.ordersRepository.find({
        relations: ['user', 'vendor'],
        order: { createdAt: 'DESC' },
      });
    }
    return [];
  }
}
