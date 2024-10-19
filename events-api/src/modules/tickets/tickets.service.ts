import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateTicketReqDto } from './dto/requests/create-ticket.dto';
import { TicketStatus } from 'src/shared/constants/ticket-status';

@Injectable()
export class TicketsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createTicket(userId: string, createTicketDto: CreateTicketReqDto) {
    const foundEvent = await this.databaseService.event.findUnique({
      where: { eventId: createTicketDto.ticketEventId },
    });

    if (!foundEvent) {
      throw new BadRequestException('Event not found');
    }

    const createdTicket = await this.databaseService.ticket.create({
      data: {
        ticketUserId: userId,
        ticketQuantity: createTicketDto.ticketQuantity,
        ticketPrice: createTicketDto.ticketPrice,
        ticketStatus: TicketStatus.Pending,
        ticketEventId: createTicketDto.ticketEventId,
      },
    });

    return createdTicket;
  }
}
