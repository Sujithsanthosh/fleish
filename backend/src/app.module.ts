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
      useFactory: (config: ConfigService) => {
        const databaseUrl = config.get<string>('DATABASE_URL');
        const sslEnabled = config.get<string>('DB_SSL', 'true') !== 'false';
        const sslConfig = sslEnabled ? { rejectUnauthorized: false } : false;

        return {
          type: 'postgres',
          ...(databaseUrl
            ? { url: databaseUrl }
            : {
                host: config.get<string>('DB_HOST', 'localhost'),
                port: config.get<number>('DB_PORT', 5432),
                username: config.get<string>('DB_USER', 'postgres'),
                password: config.get<string>('DB_PASS', 'postgres'),
                database: config.get<string>('DB_NAME', 'fleish'),
              }),
          entities: [
            User, Vendor, Product, Order, Delivery, Payment,
            SupportTicket, Settlement, JobApplication,
            SubscriptionPlan, UserSubscription,
          ],
          synchronize: true,
          ssl: sslConfig,
          extra: {
            // Render often resolves DB hosts to IPv6 first; pg `family: 4`
            // keeps connections on IPv4 when the container lacks IPv6 egress.
            family: 4,
            ssl: sslConfig,
          },
          retryAttempts: 10,
          retryDelay: 5000,
          connectTimeoutMS: 60000,
          logNotifications: true,
          logging: ['error', 'warn'],
          poolSize: config.get<number>('DB_POOL_SIZE', 10),
        };
      },
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
