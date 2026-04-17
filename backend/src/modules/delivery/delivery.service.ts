import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Delivery, DeliveryStatus } from '../../entities/delivery.entity';
import { Order, OrderStatus } from '../../entities/order.entity';
import { RealtimeGateway } from '../realtime/realtime.gateway';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(Delivery)
    private deliveryRepository: Repository<Delivery>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private realtimeGateway: RealtimeGateway,
  ) { }

  async findAll(): Promise<Delivery[]> {
    return this.deliveryRepository.find({
      relations: ['order', 'order.user', 'rider'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Delivery> {
    const delivery = await this.deliveryRepository.findOne({
      where: { id },
      relations: ['order', 'order.user', 'rider'],
    });
    if (!delivery) throw new NotFoundException('Delivery not found');
    return delivery;
  }

  async assignRider(orderId: string, riderId: string): Promise<Delivery> {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');

    const delivery = this.deliveryRepository.create({
      order: { id: orderId },
      rider: { id: riderId },
      otp: Math.floor(1000 + Math.random() * 9000).toString(),
      status: DeliveryStatus.ASSIGNED,
    });

    await this.deliveryRepository.save(delivery);
    await this.orderRepository.update(orderId, { status: OrderStatus.OUT_FOR_DELIVERY });

    // Notify rider
    this.realtimeGateway.notifyUser(riderId, 'new_delivery_assigned', {
      orderId,
      deliveryId: delivery.id,
      otp: delivery.otp,
    });

    return delivery;
  }

  async updateStatus(id: string, status: DeliveryStatus): Promise<Delivery> {
    const delivery = await this.findOne(id);
    delivery.status = status;

    if (status === DeliveryStatus.DELIVERED) {
      await this.orderRepository.update(delivery.order.id, { status: OrderStatus.DELIVERED });
    }

    await this.deliveryRepository.save(delivery);
    return delivery;
  }

  async updateLocation(id: string, lat: number, lng: number): Promise<Delivery> {
    const delivery = await this.findOne(id);
    delivery.currentLat = lat;
    delivery.currentLng = lng;
    await this.deliveryRepository.save(delivery);

    // Broadcast location to customer
    if (delivery.order.user) {
      this.realtimeGateway.notifyUser(delivery.order.user.id, 'location_update', {
        orderId: delivery.order.id,
        lat,
        lng,
        timestamp: new Date().toISOString(),
      });
    }

    return delivery;
  }

  async completeDelivery(id: string, otp?: string): Promise<Delivery> {
    const delivery = await this.findOne(id);
    if (otp && delivery.otp && otp !== delivery.otp) {
      throw new BadRequestException('Invalid OTP');
    }
    return this.updateStatus(id, DeliveryStatus.DELIVERED);
  }

  async findByRider(riderId: string): Promise<Delivery[]> {
    return this.deliveryRepository.find({
      where: { rider: { id: riderId } },
      relations: ['order', 'order.user'],
      order: { createdAt: 'DESC' },
    });
  }

  async getStats(): Promise<any> {
    const all = await this.findAll();
    return {
      total: all.length,
      assigned: all.filter(d => d.status === DeliveryStatus.ASSIGNED).length,
      pickedUp: all.filter(d => d.status === DeliveryStatus.PICKED_UP).length,
      delivered: all.filter(d => d.status === DeliveryStatus.DELIVERED).length,
      failed: all.filter(d => d.status === DeliveryStatus.FAILED).length,
    };
  }
}
