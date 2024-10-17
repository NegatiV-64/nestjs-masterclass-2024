import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateTicketDto } from './dto/create-ticket-dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class TicketsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly httpService: HttpService,
  ) {}

  async createTicket(createTicketDto: CreateTicketDto, userId: string): Promise<CreateTicketDto> {
    const existingEvent = await this.databaseService.event.findUnique({
      where: { eventId: createTicketDto.ticketEventId },
    });

    if (!existingEvent) {
      throw new BadRequestException('Event not found');
    }

    const createdTicket = await this.databaseService.ticket.create({
      data: {
        ticketPrice: createTicketDto.ticketPrice,
        ticketQuantity: createTicketDto.ticketQuantity,
        ticketEventId: createTicketDto.ticketEventId,
        ticketUserId: userId,
      },
    });

    return createdTicket;
  }
  async getAllTicketsByUserId(userId: string) {
    try {
      return await this.databaseService.ticket.findMany({
        where: { ticketUserId: userId },
      });
    } catch (error) {
      throw new Error('Error fetching tickets');
    }
  }

  async getOneTicketOfUser(userId: string) {
    return await this.databaseService.ticket.findFirst({
      where: {
        ticketUserId: userId,
      },
      take: 1,
    });
  }
  async payForTicket(ticketId: string, userId: string, paymentDetails: CreatePaymentDto) {
    const paymentApiUrl = process.env.PAYMENT_API_URL || 'http://localhost:3030/payment';
    const ticket = await this.databaseService.ticket.findFirst({
      where: {
        ticketId,
        ticketUserId: userId,
      },
    });

    if (!ticket) {
      throw new BadRequestException('Ticket not found or not owned by the user');
    }

    const { last4Digits, cardExpiry, cardHolderName, paymentToken, paymentAmount } = paymentDetails;

    try {
      const response = await lastValueFrom(
        this.httpService.post(
          paymentApiUrl,
          {
            last4: last4Digits,
            expiration: cardExpiry,
            cardholder: cardHolderName,
            amount: paymentAmount,
            paymentToken: paymentToken,
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
            },
          },
        ),
      );

      return response.data;
    } catch (error) {
      throw new InternalServerErrorException('Payment API call failed', error.response?.data || error.message);
    }
  }
  async cancelTicket(ticketId: string, userId: string) {
    const ticket = await this.databaseService.ticket.findFirst({
      where: {
        ticketId,
        ticketUserId: userId,
      },
    });

    if (!ticket) {
      throw new BadRequestException('Ticket not found or not owned by the user');
    }

    await this.databaseService.ticket.update({
      where: {
        ticketId,
      },
      data: {
        ticketStatus: 'cancelled',
      },
    });

    return { message: 'Ticket canceled successfully' };
  }
}
