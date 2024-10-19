import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { DatabaseModule } from '../database/database.module';
import { PaymentService } from '../payment/payment.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [DatabaseModule, HttpModule],
  controllers: [TicketsController],
  providers: [TicketsService, PaymentService],
})
export class TicketsModule {}
