import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateTicketReqDto } from './dto/requests/create-ticket.dto';
import { EventsService } from '../events/events.service';
import { ApiTags } from '@nestjs/swagger';
import { TicketPaymentReqDto } from './dto/requests/ticket-payment.dto';
import { PaymentsService } from '../payments/payments.service';

@Injectable()
@ApiTags('tickets')
export class TicketsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly eventsService: EventsService,
    private readonly paymentsService: PaymentsService,
  ) {}

  async createTicket(ticketUserId: string, dto: CreateTicketReqDto) {
    await this.eventsService.verifyEventExistence(dto.ticketEventId);

    const createdTicket = await this.databaseService.ticket.create({
      data: {
        ticketQuantity: dto.ticketQuantity,
        ticketPrice: dto.ticketPrice,
        ticketEventId: dto.ticketEventId,
        ticketUserId: ticketUserId,
      },
    });

    return createdTicket;
  }

  async getTickets(ticketUserId: string) {
    const tickets = await this.databaseService.ticket.findMany({
      where: {
        ticketUserId: ticketUserId,
      },
    });

    return tickets;
  }

  async getTicketById(ticketUserId: string, ticketId: string) {
    const foundTicket = await this.databaseService.ticket.findUnique({
      where: {
        ticketUserId: ticketUserId,
        ticketId: ticketId,
      },
    });

    if (!foundTicket) {
      throw new NotFoundException(`Ticket with id ${ticketId} who belongs to user with id ${ticketUserId} not found`);
    }

    return foundTicket;
  }

  async payForTicket(ticketUserId: string, ticketId: string, dto: TicketPaymentReqDto) {
    await this.verifyTicketExistenceAndOwnership(ticketUserId, ticketId);

    const transactionId = await this.paymentsService.processPayment(dto);

    const paidForTicket = await this.databaseService.ticket.update({
      where: {
        ticketUserId: ticketUserId,
        ticketId: ticketId,
      },
      data: {
        ticketStatus: 'paid',
        ticketTransactionId: transactionId,
      },
    });

    return paidForTicket;
  }

  async cancelTicket(ticketUserId: string, ticketId: string) {
    await this.verifyTicketExistenceAndOwnership(ticketUserId, ticketId);

    const cancelledTicket = await this.databaseService.ticket.update({
      where: {
        ticketUserId: ticketUserId,
        ticketId: ticketId,
      },
      data: {
        ticketStatus: 'cancelled',
        ticketTransactionId: null,
      },
    });

    return cancelledTicket;
  }

  private async verifyTicketExistenceAndOwnership(ticketUserId: string, ticketId: string) {
    const existingTicket = await this.databaseService.ticket.findUnique({
      where: {
        ticketUserId: ticketUserId,
        ticketId: ticketId,
      },
      select: {
        ticketId: true,
      },
    });

    if (!existingTicket) {
      throw new BadRequestException(`Ticket with id ${ticketId} who belongs to user with id ${ticketUserId} does not exist`);
    }
  }
}
