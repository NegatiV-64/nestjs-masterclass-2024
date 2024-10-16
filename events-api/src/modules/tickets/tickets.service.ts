import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateTicketDto } from './dto/requests/create-ticket.dto';
import { PaymentService } from '../payment/payment.service';
import { HttpService } from '@nestjs/axios';

import { PayTicketDto } from './dto/requests/pay-ticket.dto';
@Injectable()
export class TicketsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly paymentService: PaymentService,
    private readonly httpService: HttpService,
  ) {}

  async createTickets(createTickets: CreateTicketDto, userId: string) {
    const { ticketQuantity, ticketPrice, ticketEventId } = createTickets;

    const event = this.databaseService.event.findUnique({
      where: { eventId: ticketEventId },
    });

    if (!event) throw new BadRequestException('Event doesnt exist!');

    const ticket = await this.databaseService.ticket.create({
      data: {
        ticketQuantity,
        ticketPrice,
        ticketUserId: userId,
        ticketEventId,
      },
    });
    return ticket;
  }

  async getUserTickets(userId: string) {
    return await this.databaseService.ticket.findMany({
      where: { ticketUserId: userId },
    });
  }

  async getTicketById(ticketId: string, userId: string) {
    const ticket = await this.databaseService.ticket.findUnique({
      where: { ticketId },
    });

    if (!ticket || ticket.ticketUserId !== userId)
      throw new BadRequestException('Tickets does not exist or does not belong to the authenticated user.');

    return ticket;
  }

  async deleteTicket(ticketId: string, userId: string) {
    const ticket = await this.databaseService.ticket.findUnique({
      where: { ticketId },
    });

    if (!ticket || ticket.ticketUserId !== userId) {
      throw new NotFoundException('Ticket not found or does not belong to the user');
    }

    await this.databaseService.ticket.delete({
      where: { ticketId },
    });
  }

  async payForTicket(ticketId: string, userId: string, dto: PayTicketDto) {
    const ticket = await this.databaseService.ticket.findUnique({
      where: { ticketId },
    });

    if (!ticket || ticket.ticketUserId !== userId) {
      throw new BadRequestException('Ticket does not exist or does not belong to the authenticated user.');
    }
    const paymentData = {
      last4: dto.last4Digits,
      expiration: dto.cardExpiry,
      cardholder: dto.cardHolderName,
      paymentToken: dto.paymentToken,
      amount: dto.paymentAmount,
    };
    const paymentResponse = await this.paymentService.processPayment(paymentData);
    await this.databaseService.ticket.update({
      where: { ticketId },
      data: { ticketStatus: 'paid' },
    });

    return paymentResponse;
  }

  async cancelTicket(ticketId: string, userId: string) {
    const ticket = await this.databaseService.ticket.findUnique({
      where: { ticketId },
    });
    if (!ticket || ticket.ticketUserId !== userId) {
      throw new BadRequestException('Ticket does not exist or does not belong to the authenticated user.');
    }
    await this.databaseService.ticket.update({
      where: { ticketId },
      data: { ticketStatus: 'cancelled' },
    });

    return {
      message: 'Ticket cancelled successfully',
    };
  }
}
