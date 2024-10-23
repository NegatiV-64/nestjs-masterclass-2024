import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { DatabaseModule } from '../database/database.module';
import { EventsModule } from '../events/events.module';
import { TicketPaymentModule } from '../ticket-payment/ticket-payment.module';

@Module({
  imports: [DatabaseModule, EventsModule, TicketPaymentModule],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}
