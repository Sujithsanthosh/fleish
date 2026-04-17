import { Controller, Post, Get, Patch, Body, Request, UseGuards, Param, NotFoundException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { OrderStatus } from '../../entities/order.entity';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() orderData: any, @Request() req: any) {
    return this.ordersService.create(orderData, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req: any) {
    return this.ordersService.findAllByRole(req.user.role, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: any) {
    const order = await this.ordersService.findOne(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/tracking')
  async getTracking(@Param('id') id: string, @Request() req: any) {
    const order = await this.ordersService.findOne(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return {
      orderId: order.id,
      status: order.status,
      vendor: order.vendor ? { id: order.vendor.id, name: order.vendor.shopName } : null,
      delivery: order.delivery || null,
      estimatedTime: '25 mins', // In production, calculate based on distance
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: OrderStatus, @Request() req: any) {
    return this.ordersService.updateStatus(id, status, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/cancel')
  async cancel(@Param('id') id: string, @Request() req: any) {
    return this.ordersService.updateStatus(id, OrderStatus.CANCELLED, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/reorder')
  async reorder(@Param('id') id: string, @Request() req: any) {
    const original = await this.ordersService.findOne(id);
    if (!original) {
      throw new NotFoundException('Original order not found');
    }
    return this.ordersService.create(
      {
        totalAmount: original.totalAmount,
        deliveryAddress: original.deliveryAddress,
        deliveryLat: original.deliveryLat,
        deliveryLng: original.deliveryLng,
      },
      req.user.userId,
    );
  }
}
