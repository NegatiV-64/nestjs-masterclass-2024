import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { EventsRepository } from './events.repository';

@Module({
  controllers: [EventsController],
  providers: [EventsService, EventsRepository],
  imports: [DatabaseModule],
  exports: [EventsRepository],
})
export class EventsModule {}
