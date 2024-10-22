import { HttpModule } from '@nestjs/axios';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { DatabaseModule } from './../database/database.module';
import { Module } from '@nestjs/common';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [DatabaseModule, PaymentModule],
  providers:[TicketsService],
  controllers: [TicketsController],
})

export class TicketsModule {}