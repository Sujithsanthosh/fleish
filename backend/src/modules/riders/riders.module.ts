import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { RidersService } from './riders.service';
import { RidersController } from './riders.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [RidersController],
  providers: [RidersService],
  exports: [RidersService],
})
export class RidersModule {}
