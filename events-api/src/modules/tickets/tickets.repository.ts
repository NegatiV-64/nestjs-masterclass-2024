import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateTicketWithUser } from './types/create-ticket-with-user.type';
import { Prisma, Ticket } from '@prisma/client';

@Injectable()
export class TicketsRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(dto: CreateTicketWithUser): Promise<Ticket> {
    return await this.databaseService.ticket.create({
      data: {
        ticketQuantity: dto.ticketQuantity,
        ticketPrice: dto.ticketPrice,
        ticketEvent: {
          connect: { eventId: dto.ticketEventId },
        },
        ticketUser: {
          connect: { userId: dto.ticketUserId },
        },
      },
    });
  }
}
