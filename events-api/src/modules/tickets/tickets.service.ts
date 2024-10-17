import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { DatabaseService } from '../database/database.service';
import { TicketStatus } from 'src/shared/constants/ticket-status.constant';

@Injectable()
export class TicketsService {
  constructor(private readonly databaseService: DatabaseService) { }

  async createTicket(userId: string, dto: CreateTicketDto) {
    const existingEventByName = await this.databaseService.event.findUnique({
      where: {
        eventId: dto.ticketEventId,
      }
    });

    if (!existingEventByName) throw new NotFoundException(`Event with id ${dto.ticketEventId} not found`)

    const createdTicket = await this.databaseService.ticket.create({
      data: {
        ticketQuantity: dto.ticketQuantity,
        ticketPrice: dto.ticketPrice,
        ticketEventId: dto.ticketEventId,
        ticketStatus: TicketStatus.PENDING,
        ticketUserId: userId
      },
    });

    return createdTicket;
  }

  async getAllTickets(userId: string) {
    const user = await this.databaseService.user.findUnique({
      where: {
        userId
      }
    });

    if (!user) throw new NotFoundException(`User with ${userId} not found`);

    const userTickets = await this.databaseService.ticket.findMany({
      where: {
        ticketUserId: userId
      }
    });

    if (!userTickets) throw new NotFoundException("User do not have tickets");

    return userTickets;
  }

  async getTicketById(ticketId: string) {
    const ticket = await this.databaseService.ticket.findUnique({
      where: {
        ticketId
      }
    });

    if (!ticket) throw new NotFoundException(`Ticket with ${ticketId} not found`);

    return ticket;
  }
}
