import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTicketReqDto, TicketPaymentReqDto } from './dto/requests';
import { DatabaseService } from '../database/database.service';
import { EventsService } from '../events/events.service';
import { TicketPaymentService } from '../ticket-payment/ticket-payment.service';

@Injectable()
export class TicketsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly eventsService: EventsService,
    private readonly paymentService: TicketPaymentService,
  ) {}

  async createTicket(dto: CreateTicketReqDto, ticketUserId: string) {
    const existingEvent = await this.eventsService.getEventById(dto.ticketEventId);

    const createdTicket = await this.databaseService.ticket.create({
      data: {
        ticketQuantity: dto.ticketQuantity,
        ticketPrice: dto.ticketPrice,
        ticketStatus: 'pending',
        ticketEvent: {
          connect: { eventId: existingEvent.eventId },
        },
        ticketUser: {
          connect: { userId: ticketUserId },
        },
      },
    });

    return createdTicket;
  }

  async getTickets(userId: string) {
    const userTickets = await this.databaseService.ticket.findMany({
      where: {
        ticketUserId: userId,
      },
    });

    return userTickets;
  }

  async getTicketById(ticketId: string, userId: string) {
    const foundTicket = await this.databaseService.ticket.findUnique({
      where: {
        ticketId: ticketId,
        ticketUserId: userId,
      },
    });

    if (!foundTicket) {
      throw new BadRequestException(`Invalid ticket or user Id`);
    }

    return foundTicket;
  }

  async payForTicket(ticketId: string, userId: string, dto: TicketPaymentReqDto) {
    const existingValidTicket = await this.getTicketById(ticketId, userId);

    if (existingValidTicket.ticketStatus == 'paid') {
      return existingValidTicket;
    }

    const paymentResult = await this.paymentService.processTransaction(dto);

    const updatedTicket = await this.databaseService.ticket.update({
      where: {
        ticketId: ticketId,
        ticketUserId: userId,
      },
      data: {
        ticketStatus: 'paid',
        ticketTransactionId: paymentResult.transactionId,
      },
    });

    return updatedTicket;
  }

  async cancelPayment(ticketId: string, userId: string) {
    const existingValidTicket = await this.getTicketById(ticketId, userId);

    if (existingValidTicket.ticketStatus == 'canceled') {
      return existingValidTicket;
    }

    const updatedTicket = await this.databaseService.ticket.update({
      where: {
        ticketId: ticketId,
        ticketUserId: userId,
      },
      data: { ticketStatus: 'canceled' },
    });

    return updatedTicket;
  }
}
