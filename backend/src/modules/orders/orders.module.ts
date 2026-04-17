import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { Order } from '../../entities/order.entity';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { VendorsModule } from '../vendors/vendors.module';
import { AssignmentProcessor } from './assignment.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    BullModule.registerQueue({
      name: 'order-assignment',
    }),
    VendorsModule,
  ],
  providers: [OrdersService, AssignmentProcessor],
  controllers: [OrdersController],
})
export class OrdersModule {}
