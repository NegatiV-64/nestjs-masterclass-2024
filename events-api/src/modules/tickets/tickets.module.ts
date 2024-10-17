import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { JwtService } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [TicketsController],
  providers: [TicketsService, JwtService],
  imports: [DatabaseModule, HttpModule],
})
export class TicketsModule {}
