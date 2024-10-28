import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CreateTicketDto, PayTicketDto } from './dto';
import { DatabaseService } from '../database/database.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TicketsService {
  constructor(
    private database: DatabaseService,
    private httpService: HttpService,
  ) {}

  async createTicket(data: CreateTicketDto, userId: string) {
    const event = await this.database.event.findUnique({ where: { eventId: data.ticketEventId } });
    if (!event) throw new HttpException('Event not found', HttpStatus.BAD_REQUEST);

    return this.database.ticket.create({
      data: { ...data, ticketTransactionId: uuidv4(), ticketUserId: userId, ticketStatus: 'pending' },
    });
  }

  async getUserTickets(userId: string) {
    return this.database.ticket.findMany({ where: { ticketUserId: userId } });
  }

  async getTicketById(ticketId: string, userId: string) {
    const ticket = await this.database.ticket.findFirst({ where: { ticketId, ticketUserId: userId } });
    if (!ticket) throw new HttpException('Ticket not found', HttpStatus.BAD_REQUEST);
    return ticket;
  }

  async payTicket(ticketId: string, userId: string, data: PayTicketDto) {
    const ticket = await this.database.ticket.findFirst({ where: { ticketId, ticketUserId: userId } });
    if (!ticket) throw new HttpException('Ticket not found', HttpStatus.BAD_REQUEST);

    const response = await this.processPayment(data);
    if (response.status !== HttpStatus.OK) throw new HttpException('Payment failed', HttpStatus.BAD_REQUEST);

    return this.database.ticket.update({
      where: { ticketId },
      data: { ticketStatus: 'paid', ticketTransactionId: response.data.transactionId },
    });
  }

  async cancelTicket(ticketId: string, userId: string) {
    const ticket = await this.database.ticket.findFirst({ where: { ticketId, ticketUserId: userId } });
    if (!ticket) throw new HttpException('Ticket not found', HttpStatus.BAD_REQUEST);

    return this.database.ticket.update({ where: { ticketId }, data: { ticketStatus: 'cancelled' } });
  }

  private async processPayment(data: PayTicketDto) {
    const url = `${process.env.PAYMENT_API_URL}/payment`;
    const headers = { Authorization: `Bearer ${process.env.PAYMENT_API_ACCESS_TOKEN}` };

    const paymentData = {
      last4: data.last4Digits,
      expiration: data.cardExpiry,
      cardholder: data.cardHolderName,
      amount: data.paymentAmount,
      paymentToken: data.paymentToken,
    };

    return firstValueFrom(this.httpService.post(url, paymentData, { headers }));
  }
}
