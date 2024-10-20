import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateTicketWithUser } from './types/create-ticket-with-user.type';
import { ListTicketsParamsReqDto } from './dto/requests/list-tickets-params.dto';
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

  async getAllByUserId(searchParams: ListTicketsParamsReqDto, ticketUserId: string): Promise<Ticket[]> {
    const page = searchParams.page ?? 1;
    const limit = searchParams.limit ?? 20;
    const orderByQuery = {};

    if (searchParams.sortBy) {
      orderByQuery[searchParams.sortBy] = searchParams.sortOrder ?? 'asc';
    }

    return await this.databaseService.ticket.findMany({
      where: {
        ticketUserId,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: orderByQuery,
    });
  }

  async getById(ticketId: string): Promise<Ticket | null> {
    return await this.databaseService.ticket.findUnique({
      where: {
        ticketId,
      },
    });
  }

  async updateById(ticketId: string, dto: Prisma.TicketUpdateInput): Promise<Ticket> {
    return await this.databaseService.ticket.update({
      where: {
        ticketId,
      },
      data: dto,
    });
  }
}
