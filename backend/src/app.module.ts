import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { BullModule } from '@nestjs/bullmq';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { VendorsModule } from './modules/vendors/vendors.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { DeliveryModule } from './modules/delivery/delivery.module';
import { CustomersModule } from './modules/customers/customers.module';
import { RidersModule } from './modules/riders/riders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { RealtimeModule } from './modules/realtime/realtime.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { HrModule } from './modules/hr/hr.module';
import { SupportTicketsModule } from './modules/support-tickets/support-tickets.module';
import { UploadModule } from './modules/upload/upload.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { ApplicationsModule } from './modules/applications/applications.module';

import { Employee } from './entities/employee.entity';
import { Attendance } from './entities/attendance.entity';
import { User } from './entities/user.entity';
import { Vendor } from './entities/vendor.entity';
import { Product } from './entities/product.entity';
import { Order } from './entities/order.entity';
import { Delivery } from './entities/delivery.entity';
import { Payment } from './entities/payment.entity';
import { SupportTicket } from './entities/support-ticket.entity';
import { Settlement } from './entities/settlement.entity';
import { JobApplication } from './entities/job-application.entity';
import { SubscriptionPlan } from './entities/subscription-plan.entity';
import { UserSubscription } from './entities/user-subscription.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USER', 'postgres'),
        password: config.get<string>('DB_PASS', 'postgres'),
        database: config.get<string>('DB_NAME', 'fleish'),
        entities: [
          User, Vendor, Product, Order, Delivery, Payment,
          SupportTicket, Settlement, JobApplication,
          SubscriptionPlan, UserSubscription,
        ],
        synchronize: true,
        ssl: { rejectUnauthorized: false },
        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
        retryAttempts: 10,
        retryDelay: 5000,
        connectTimeoutMS: 60000,
        logNotifications: true,
        logging: ['error', 'warn'],
        poolSize: config.get<number>('DB_POOL_SIZE', 10),
      }),
    }),
    // BullModule/Redis disabled - not available in production environment
    AuthModule,
    UsersModule,
    VendorsModule,
    ProductsModule,
    OrdersModule,
    DeliveryModule,
    CustomersModule,
    RidersModule,
    PaymentsModule,
    RealtimeModule,
    NotificationsModule,
    HrModule,
    SupportTicketsModule,
    UploadModule,
    SubscriptionsModule,
    ApplicationsModule,
  ],
})
export class AppModule { }
