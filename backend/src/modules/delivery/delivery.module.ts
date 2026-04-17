import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Delivery } from '../../entities/delivery.entity';
import { Order } from '../../entities/order.entity';
import { DeliveryService } from './delivery.service';
import { DeliveryController } from './delivery.controller';
import { RealtimeModule } from '../realtime/realtime.module';

@Module({
  imports: [TypeOrmModule.forFeature([Delivery, Order]), RealtimeModule],
  controllers: [DeliveryController],
  providers: [DeliveryService],
  exports: [DeliveryService],
})
export class DeliveryModule { }
