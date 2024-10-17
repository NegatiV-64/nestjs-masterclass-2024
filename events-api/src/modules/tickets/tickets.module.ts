import { HttpModule } from '@nestjs/axios';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { DatabaseModule } from './../database/database.module';
import { Module } from '@nestjs/common';
import { PaymentService } from '../payment/payment.service';

@Module({
  imports: [DatabaseModule, HttpModule],
  providers:[TicketsService, PaymentService],
  controllers: [TicketsController],
})

export class TicketsModule {}