import { Module } from '@nestjs/common';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { PaymentService } from '../payment/payment.service';
import { DatabaseModule } from '../database/database.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [DatabaseModule, HttpModule],
  providers: [TicketsService, PaymentService],
  controllers: [TicketsController],
})
export class TicketsModule {}
