import { Module } from '@nestjs/common';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { TicketsRepository } from './tickets.repository';
import { DatabaseModule } from '../database/database.module';
import { EventsModule } from '../events/events.module';

@Module({
  controllers: [TicketsController],
  providers: [TicketsService, TicketsRepository],
  imports: [DatabaseModule, TicketPaymentsModule, EventsModule],
})
export class TicketsModule {}
