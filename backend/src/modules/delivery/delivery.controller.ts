import { Controller, Get, Post, Put, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { DeliveryStatus } from '../../entities/delivery.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('deliveries')
export class DeliveryController {
  constructor(private deliveryService: DeliveryService) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.deliveryService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('stats')
  async getStats() {
    return this.deliveryService.getStats();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.deliveryService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('rider/:riderId')
  async findByRider(@Param('riderId') riderId: string) {
    return this.deliveryService.findByRider(riderId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('assign')
  async assignRider(@Body('orderId') orderId: string, @Body('riderId') riderId: string) {
    return this.deliveryService.assignRider(orderId, riderId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: DeliveryStatus) {
    return this.deliveryService.updateStatus(id, status);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/location')
  async updateLocation(@Param('id') id: string, @Body('lat') lat: number, @Body('lng') lng: number) {
    return this.deliveryService.updateLocation(id, lat, lng);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/complete')
  async completeDelivery(@Param('id') id: string, @Body('otp') otp?: string) {
    return this.deliveryService.completeDelivery(id, otp);
  }
}
