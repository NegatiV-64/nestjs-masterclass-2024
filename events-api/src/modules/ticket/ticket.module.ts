import { Module } from '@nestjs/common';
import { TicketsController } from './ticket.controller';
import { TicketsService } from './ticket.service';
import { HttpModule } from '@nestjs/axios';
import { DatabaseService } from '../database/database.service';

@Module({
  imports: [HttpModule],
  controllers: [TicketsController],
  providers: [TicketsService, DatabaseService],
})
export class TicketsModule {}
