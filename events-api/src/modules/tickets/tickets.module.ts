import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { EventsModule } from '../events/events.module';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  controllers: [TicketsController],
  providers: [TicketsService],
  imports: [DatabaseModule, EventsModule, PaymentsModule],
})
export class TicketsModule {}
