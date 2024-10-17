import { Module } from '@nestjs/common';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  controllers: [TicketsController],
  providers: [TicketsService],
  imports: [DatabaseModule]
})
export class TicketsModule {}
