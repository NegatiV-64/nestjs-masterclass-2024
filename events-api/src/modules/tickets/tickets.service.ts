import { BadRequestException, Injectable } from '@nestjs/common';
import { TicketsRepository } from './tickets.repository';
import { ListTicketsParamsReqDto } from './dto/requests/list-tickets-params.dto';
import { CreateTicketWithUser } from './types/create-ticket-with-user.type';
import { TicketPaymentsService } from '../ticket-payments/ticket-payments.service';
import { PayTicketReqDto } from './dto/requests/pay-ticket.dto';
import { EventsRepository } from '../events/events.repository';

@Injectable()
export class TicketsService {
  constructor(
    private readonly ticketsRepository: TicketsRepository,
    private readonly ticketPaymentsService: TicketPaymentsService,
    private readonly eventsRepository: EventsRepository,
  ) {}

  async createTicket(dto: CreateTicketWithUser) {
    const event = await this.eventsRepository.getById(dto.ticketEventId);

    if (!event) {
      throw new BadRequestException(`Event with id ${dto.ticketEventId} not found`);
    }

    return await this.ticketsRepository.create(dto);
  }

  async listTickets(searchParams: ListTicketsParamsReqDto, ticketUserId: string) {
    return await this.ticketsRepository.getAllByUserId(searchParams, ticketUserId);
  }

  async getTicketById(ticketId: string, ticketUserId: string) {
    const foundTicket = await this.ticketsRepository.getById(ticketId);

    if (!foundTicket) {
      throw new BadRequestException(`Ticket with id ${ticketId} not found`);
    }

    if (foundTicket.ticketUserId !== ticketUserId) {
      throw new BadRequestException('You are not authorized to view this ticket');
    }

    return foundTicket;
  }

  async payForTicket(dto: PayTicketReqDto, ticketId: string, ticketUserId: string) {
    const ticket = await this.getTicketById(ticketId, ticketUserId);

    if (ticket.ticketStatus === 'paid') {
      throw new BadRequestException('Ticket is already paid');
    }

    const payment = await this.ticketPaymentsService.processPayment(dto);

    const updatedTicket = await this.ticketsRepository.updateById(ticketId, { ticketStatus: 'paid', ticketTransactionId: payment.transactionId });

    return updatedTicket;
  }
}
