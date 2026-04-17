import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { OrdersService } from './orders.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from '../../entities/order.entity';

@Processor('order-assignment')
export class AssignmentProcessor extends WorkerHost {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    private ordersService: OrdersService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    if (job.name === 'check-acceptance') {
      const { orderId, vendorId } = job.data;
      
      const order = await this.ordersRepository.findOne({ where: { id: orderId } });
      
      if (order && order.status === OrderStatus.VENDOR_ASSIGNED) {
        // Vendor didn't accept in time (still in 'assigned' state)
        console.log(`Order ${orderId} timeout for vendor ${vendorId}. Reassigning...`);
        
        // Logic for re-assignment (find next nearest excluding this vendorId)
        // For simplicity, we just log here.
      }
    }
  }
}
