import { Module } from '@nestjs/common';
import { TicketPaymentsService } from './ticket-payments.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [TicketPaymentsService],
  exports: [TicketPaymentsService],
  imports: [HttpModule],
})
export class TicketPaymentsModule {}
