import { BadRequestException, Injectable } from '@nestjs/common';
import { TicketsRepository } from './tickets.repository';
import { ListTicketsParamsReqDto } from './dto/requests/list-tickets-params.dto';
import { CreateTicketWithUser } from './types/create-ticket-with-user.type';
import { TicketPaymentsService } from '../ticket-payments/ticket-payments.service';
import { PayTicketReqDto } from './dto/requests/pay-ticket.dto';
import { EventsRepository } from '../events/events.repository';
import { Ticket } from '@prisma/client';

@Injectable()
export class TicketsService {
  constructor(
    private readonly ticketsRepository: TicketsRepository,
    private readonly ticketPaymentsService: TicketPaymentsService,
    private readonly eventsRepository: EventsRepository,
  ) {}

  async createTicket(dto: CreateTicketWithUser): Promise<Ticket> {
    const event = await this.eventsRepository.getById(dto.ticketEventId);

    if (!event) {
      throw new BadRequestException(`Event with id ${dto.ticketEventId} not found`);
    }

    return await this.ticketsRepository.create(dto);
  }

  async listTickets(searchParams: ListTicketsParamsReqDto, ticketUserId: string): Promise<Ticket[]> {
    return await this.ticketsRepository.getAllByUserId(searchParams, ticketUserId);
  }

  async getTicketById(ticketId: string, ticketUserId: string): Promise<Ticket> {
    const foundTicket = await this.ticketsRepository.getById(ticketId);

    if (!foundTicket) {
      throw new BadRequestException(`Ticket with id ${ticketId} not found`);
    }

    if (foundTicket.ticketUserId !== ticketUserId) {
      throw new BadRequestException('You are not authorized to view this ticket');
    }

    return foundTicket;
  }

  async payForTicket(dto: PayTicketReqDto, ticketId: string, ticketUserId: string): Promise<Ticket> {
    const ticket = await this.ticketsRepository.getById(ticketId);

    if (!ticket) {
      throw new BadRequestException(`Ticket with id ${ticketId} not found`);
    }

    if (ticket.ticketUserId !== ticketUserId) {
      throw new BadRequestException('You are not authorized to pay for this ticket');
    }

    if (ticket.ticketStatus === 'paid') {
      throw new BadRequestException('Ticket is already paid');
    }

    const payment = await this.ticketPaymentsService.processPayment(dto);

    const updatedTicket = await this.ticketsRepository.updateById(ticketId, { ticketStatus: 'paid', ticketTransactionId: payment.transactionId });

    return updatedTicket;
  }

  async cancelTicket(ticketId: string, ticketUserId: string): Promise<Ticket> {
    const ticket = await this.ticketsRepository.getById(ticketId);

    if (!ticket) {
      throw new BadRequestException(`Ticket with id ${ticketId} not found`);
    }

    if (ticket.ticketUserId !== ticketUserId) {
      throw new BadRequestException('You are not authorized to cancel this ticket');
    }

    if (ticket.ticketStatus === 'cancelled') {
      throw new BadRequestException('Ticket is already cancelled');
    }

    const cancelledTicket = await this.ticketsRepository.updateById(ticketId, { ticketStatus: 'cancelled' });

    return cancelledTicket;
  }
}
